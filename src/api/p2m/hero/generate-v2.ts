import { prisma } from "../../../magicreel/db/prisma";
import { Request, Response } from "express";
import { buildHeroPrompt } from "../../../magicreel/prompts/heroPrompt";
import { FashnService } from "../../../magicreel/services/fashn.service";
import { finalizeBilling } from "../../../billing/billing.middleware";

const fashn = new FashnService();

export async function generateHeroV2(req: Request, res: Response) {
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
       USER FETCH (SAFE)
    ========================= */

    let user = (req as any).user;

if (!user || !user.id) {
  return res.status(401).json({
    error: "Unauthorized",
  });
}

const userId = user.userId || user.id;

/* =========================
   CREDIT GUARD (ADD HERE)
========================= */

const dbUser = await prisma.user.findUnique({
  where: { id: userId },
  select: {
  creditsAvailable: true,
  freeHeroUsed: true,
}
});

if (!dbUser) {
  return res.status(404).json({ error: "User not found" });
}

// ❌ BLOCK if no credits AND free already used
if (
  dbUser.creditsAvailable <= 0 &&
  dbUser.freeHeroUsed === true
) {
  return res.status(403).json({
    error: "No credits left",
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

    const frontJob = await prisma.productToModelJob.create({
  data: {
    userId,
    productImageUrl: garmentFrontImageUrl,
    modelImageUrl: avatarFaceImageUrl,
    engine: "fashn",
    engineJobId: "pending",
    status: "running",
  },
});

// ✅ ADD THIS LINE
(req as any).billing.predictionId = frontJob.id;

    const frontRunId = await fashn.runProductToModel({
  garmentImageUrl: garmentFrontImageUrl,
  modelImageUrl: avatarFaceImageUrl,
  prompt: frontPrompt,
});

    await prisma.productToModelJob.update({
      where: { id: frontJob.id },
      data: {
        engineJobId: frontRunId,
      },
    });

    /* =========================
       BACK HERO (OPTIONAL)
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
          userId,
          productImageUrl: garmentBackImageUrl,
          modelImageUrl: avatarBackImageUrl,
          engine: "fashn",
          engineJobId: "pending",
          status: "running",
        },
      });

      backRunId = await fashn.runProductToModel({
  garmentImageUrl: garmentBackImageUrl,
  modelImageUrl: avatarBackImageUrl,
  prompt: backPrompt,
});

      await prisma.productToModelJob.update({
        where: { id: backJob.id },
        data: {
          engineJobId: backRunId,
        },
      });
    }

    /* =========================
   BILLING
========================= */

// ✅ attach prediction id for billing linkage
(req as any).predictionId = frontJob.id;

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