import { Request, Response } from "express";
import { prisma } from "../../../magicreel/db/prisma";
import { reelV1Service } from "../../../magicreel/services/reelV1.service";

const db = prisma as any;

export async function generateReelV1Controller(
  req: Request,
  res: Response
) {
  try {
    const { jobId, heroPreviewUrl } = req.body;

    if (!jobId || !heroPreviewUrl) {
      return res.status(400).json({
        error: "Missing params",
      });
    }

    console.log("🎬 Reel request received:", jobId);

    // ✅ CREATE JOB
    await db.reelJob.create({
      data: {
        id: jobId,
        status: "processing",
        inputImageUrl: heroPreviewUrl,
      },
    });

    // 🔥 RUN DIRECTLY (NO BACKGROUND)
    const result = await reelV1Service.generate({
      imageUrl: heroPreviewUrl,
    });

    await db.reelJob.update({
      where: { id: jobId },
      data: {
        status: "completed",
        reelVideoUrl: result.reelVideoUrl,
      },
    });

    return res.json({
      success: true,
      reelVideoUrl: result.reelVideoUrl,
    });

  } catch (error) {
    console.error("❌ Reel generation error:", error);

    return res.status(500).json({
      error: "Reel generation failed",
    });
  }
}