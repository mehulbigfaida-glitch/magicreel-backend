import { prisma } from "../../../magicreel/db/prisma";
import { Request, Response } from "express";
import { buildGptHeroPrompt } from "../../../magicreel/prompts/buildGptHeroPrompt";
import { gptHeroProvider } from "../../../magicreel/services/image-generation/providers/GptHeroProvider";
import { finalizeBilling } from "../../../billing/billing.middleware";

// GPT Hero Provider

export async function generateHeroV3(req: Request, res: Response) {
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
  },
});

if (!dbUser) {
  return res.status(404).json({ error: "User not found" });
}

// ❌ BLOCK if no credits
if (dbUser.creditsAvailable <= 0) {
  return res.status(403).json({
    error: "No credits left",
  });
}

/* =========================
   FRONT HERO
========================= */
console.log("=== HERO REQUEST ===", {
  categoryKey,
  avatarGender,
  styling,
  });


    const frontPrompt = buildGptHeroPrompt({
  categoryKey,
  avatarGender,
  styling,
  heroView: "front",
});

console.log(
  "✅ Front prompt built:",
  frontPrompt.length,
  "characters"
);

    const frontJob = await prisma.productToModelJob.create({
  data: {
    userId,
    productImageUrl: garmentFrontImageUrl,
    modelImageUrl: avatarFaceImageUrl,
    engine: "gpt-image-2",
    engineJobId: "pending",
    status: "running",
  },
});

// ✅ ADD THIS LINE
(req as any).billing.predictionId = frontJob.id;

    const frontResult =
  await gptHeroProvider.generateHero({
    garmentImageUrl: garmentFrontImageUrl,
    modelImageUrl: avatarFaceImageUrl,
    prompt: frontPrompt,
  });

await prisma.productToModelJob.update({
  where: { id: frontJob.id },
  data: {
    status: "completed",
    resultImageUrl: frontResult.imageUrl,
  },
});

const frontRunId = frontJob.id;

    /* =========================
       BACK HERO (OPTIONAL)
    ========================= */

    let backRunId: string | null = null;

    if (avatarBackImageUrl && garmentBackImageUrl) {
      const backCategoryKey = `${categoryKey}_BACK`;

      const backPrompt = buildGptHeroPrompt({
  categoryKey: backCategoryKey,
  avatarGender,
  styling,
  heroView: "back",
});

      const backJob = await prisma.productToModelJob.create({
        data: {
          userId,
          productImageUrl: garmentBackImageUrl,
          modelImageUrl: avatarBackImageUrl,
          engine: "gpt-image-2",
          engineJobId: "pending",
          status: "running",
        },
      });

      const backResult =
  await gptHeroProvider.generateHero({
    garmentImageUrl: garmentBackImageUrl,
    modelImageUrl: avatarBackImageUrl,
    prompt: backPrompt,
  });

await prisma.productToModelJob.update({
  where: { id: backJob.id },
  data: {
    status: "completed",
    resultImageUrl: backResult.imageUrl,
  },
});

backRunId = backJob.id;
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
    console.error("HERO V3 ERROR:", err);

    return res.status(500).json({
      error: err.message || "Hero generation failed",
    });
  }
}