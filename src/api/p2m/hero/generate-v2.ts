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
      lookbookId,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (
      !categoryKey ||
      !avatarGender ||
      !avatarFaceImageUrl ||
      !garmentFrontImageUrl ||
      !lookbookId
    ) {
      return res.status(400).json({
        error: "Missing required hero inputs (including lookbookId)",
      });
    }

    /* =========================
       FRONT HERO
    ========================= */

    const frontPrompt = buildHeroPrompt({
      categoryKey,
      avatarGender,
      styling,
    });

    const frontJob = await prisma.render.create({
      data: {
        pose: "hero",
        engine: "QWEN",
        modelImageUrl: avatarFaceImageUrl,
        garmentImageUrl: garmentFrontImageUrl,
        outputImageUrl: null,
        status: "queued",
        lookbookId: lookbookId,
        type: "HERO",
      },
    });

    const frontRunId = frontJob.id;

    await heroQueue.add(
      "hero-job",
      {
        jobId: frontRunId,
        type: "front",
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
       BACK HERO
    ========================= */

    let backRunId: string | null = null;

    if (avatarBackImageUrl && garmentBackImageUrl) {
      const backPrompt = buildHeroPrompt({
        categoryKey: `${categoryKey}_BACK`,
        avatarGender,
        styling,
      });

      const backJob = await prisma.render.create({
        data: {
          pose: "hero_back",
          engine: "QWEN",
          modelImageUrl: avatarBackImageUrl,
          garmentImageUrl: garmentBackImageUrl,
          outputImageUrl: null,
          status: "queued",
          lookbookId: lookbookId,
          type: "HERO",
        },
      });

      backRunId = backJob.id;

      await heroQueue.add(
        "hero-job",
        {
          jobId: backRunId,
          type: "back",
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