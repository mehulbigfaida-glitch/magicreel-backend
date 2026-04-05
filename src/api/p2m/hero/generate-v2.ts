import prisma from "../../../magicreel/db/prisma";
import { Request, Response } from "express";
import { buildHeroPrompt } from "../../../magicreel/prompts/heroPrompt";
import { FashnService } from "../../../magicreel/services/fashn.service";
import { finalizeBilling } from "../../../billing/billing.middleware"; // ✅ USE THIS

const fashn = new FashnService();

export async function generateHeroV2(
  req: Request,
  res: Response
) {
  try {

    const {
      categoryKey,
      avatarGender,
      avatarFaceImageUrl,
      garmentFrontImageUrl,
      styling,
      avatarBackImageUrl,
      garmentBackImageUrl,
    } = req.body;

    if (
      !categoryKey ||
      !avatarGender ||
      !avatarFaceImageUrl ||
      !garmentFrontImageUrl
    ) {
      return res.status(400).json({
        error: "Missing required hero inputs",
      });
    }

    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const now = new Date().toISOString();

    /* =========================
       FRONT HERO
    ========================= */

    const frontPrompt = buildHeroPrompt({
      categoryKey,
      avatarGender,
      styling,
    });

    const frontJob = await prisma.productToModelJob.create({
      data: {
        userId: user.id,
        productImageUrl: garmentFrontImageUrl,
        modelImageUrl: avatarFaceImageUrl,
        engine: "fashn",
        engineJobId: "pending",
        status: "running",
      },
    });

    const frontRunId = await fashn.runProductToModel({
      jobId: frontJob.id,
      lookbookId: "hero",
      pose: "hero" as any,
      engine: "fashn",
      prompt: frontPrompt,
      modelImageUrl: avatarFaceImageUrl,
      garmentImageUrl: garmentFrontImageUrl,
      status: "pending",
      retries: 0,
      createdAt: now,
      updatedAt: now,
    });

    await prisma.productToModelJob.update({
      where: { id: frontJob.id },
      data: {
        engineJobId: frontRunId,
      },
    });

    /* =========================
       BACK HERO
    ========================= */

    let backRunId: string | null = null;

    if (avatarBackImageUrl && garmentBackImageUrl) {
      const backCategoryKey = `${categoryKey}_BACK`;

      const backPrompt = buildHeroPrompt({
        categoryKey: backCategoryKey,
        avatarGender,
        styling,
      });

      const backJob = await prisma.productToModelJob.create({
        data: {
          userId: user.id,
          productImageUrl: garmentBackImageUrl,
          modelImageUrl: avatarBackImageUrl,
          engine: "fashn",
          engineJobId: "pending",
          status: "running",
        },
      });

      backRunId = await fashn.runProductToModel({
        jobId: backJob.id,
        lookbookId: "hero",
        pose: "hero_back" as any,
        engine: "fashn",
        prompt: backPrompt,
        modelImageUrl: avatarBackImageUrl,
        garmentImageUrl: garmentBackImageUrl,
        status: "pending",
        retries: 0,
        createdAt: now,
        updatedAt: now,
      });

      await prisma.productToModelJob.update({
        where: { id: backJob.id },
        data: {
          engineJobId: backRunId,
        },
      });
    }

    /* =========================
       ✅ BILLING — SINGLE SOURCE
    ========================= */

    try {
      await finalizeBilling(req); // ✅ ONLY THIS
    } catch (e) {
      console.error("Billing failed AFTER success:", e);
      // do not block response
    }

    return res.json({
      frontRunId,
      backRunId,
    });

  } catch (err: any) {
    console.error("HERO V2 ERROR:", err);

    return res.status(500).json({
      error: err.message || "Hero generation failed",
    });
  }
}