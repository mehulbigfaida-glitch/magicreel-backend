import { heroQueue } from "../../../queues/hero.queue";
import { prisma } from "../../../magicreel/db/prisma";
import { Request, Response } from "express";
import { buildHeroPrompt } from "../../../magicreel/prompts/heroPrompt";
import { finalizeBilling } from "../../../billing/billing.middleware";

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

    /* =========================
       ✅ SAFE USER (NO TOKEN BUGS)
    ========================= */

    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const userId = user.id;

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
        userId,
        productImageUrl: garmentFrontImageUrl,
        modelImageUrl: avatarFaceImageUrl,
        engine: "fashn",
        engineJobId: "pending",
        status: "queued", // ✅ IMPORTANT (not running)
      },
    });

    const frontRunId = frontJob.id;

    await heroQueue.add(
      "hero-generation", // ✅ MUST match worker
      {
        jobId: frontRunId,
        type: "front",
        pose: "hero",
        prompt: frontPrompt,
        modelImageUrl: avatarFaceImageUrl,
        garmentImageUrl: garmentFrontImageUrl,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    /* =========================
       BACK HERO (OPTIONAL)
    ========================= */

    let backRunId: string | null = null;

    if (avatarBackImageUrl && garmentBackImageUrl) {
      const backPrompt = buildHeroPrompt({
        categoryKey: `${categoryKey}_BACK`,
        avatarGender,
        styling,
      });

      const backJob = await prisma.productToModelJob.create({
        data: {
          userId,
          productImageUrl: garmentBackImageUrl,
          modelImageUrl: avatarBackImageUrl,
          engine: "fashn",
          engineJobId: "pending",
          status: "queued",
        },
      });

      backRunId = backJob.id;

      await heroQueue.add(
        "hero-generation", // ✅ SAME NAME
        {
          jobId: backRunId,
          type: "back",
          pose: "hero_back",
          prompt: backPrompt,
          modelImageUrl: avatarBackImageUrl,
          garmentImageUrl: garmentBackImageUrl,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );
    }

    /* =========================
       BILLING
    ========================= */

    try {
      await finalizeBilling(req);
    } catch (e) {
      console.error("Billing failed AFTER success:", e);
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