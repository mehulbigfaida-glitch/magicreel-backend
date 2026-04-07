// src/api/p2m/hero/status.ts
// 🔒 HERO STATUS + ENHANCEMENT (PRISMA-ALIGNED)

import { Request, Response } from "express";
import prisma from "../../../magicreel/db/prisma";
import { FashnService } from "../../../magicreel/services/fashn.service";
import { enhanceHeroImage } from "../../../magicreel/services/heroEnhance.service";

export async function getHeroStatus(
  req: Request,
  res: Response
): Promise<void> {
  const { jobId } = req.params;

  // 🔒 jobId maps to Prisma Render.id
  const render = await prisma.render.findUnique({
    where: { id: jobId },
  });

  if (!render) {
    res.status(404).json({ error: "Render job not found" });
    return;
  }

  // 1️⃣ Already completed & enhanced
  if (render.status === "completed" && render.outputImageUrl) {
    res.json({
      status: "completed",
      resultImageUrl: render.outputImageUrl,
    });
    return;
  }

  const fashn = new FashnService();
  const fashnStatus = await fashn.pollStatus(render.id);

  // 2️⃣ FASHN still running
  if (fashnStatus.status !== "completed") {
    res.json({
      status:
        fashnStatus.status === "running"
          ? "fashn_running"
          : "pending",
    });
    return;
  }

  // 3️⃣ FASHN completed → enhance once
  const rawImageUrl = fashnStatus.output?.[0];

  if (!rawImageUrl) {
    res.status(500).json({
      status: "failed",
      error: "FASHN returned no output",
    });
    return;
  }

  // Mark enhancing
  await prisma.render.update({
    where: { id: render.id },
    data: { status: "enhancing" },
  });

  // 🔒 Use existing hero enhancement service
  const enhanced = await enhanceHeroImage({
    jobId: render.id,
    heroBaseUrl: rawImageUrl,
  });

  // Save enhanced result
  await prisma.render.update({
    where: { id: render.id },
    data: {
      status: "completed",
      outputImageUrl: enhanced.heroPreviewUrl,
    },
  });

  res.json({
    status: "completed",
    resultImageUrl: enhanced.heroPreviewUrl,
  });
}
