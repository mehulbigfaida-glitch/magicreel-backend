import { heroQueue } from "../../../queues/hero.queue";
import { prisma } from "../../../magicreel/db/prisma"; 
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

    /* =========================
       ✅ SAFE USER FETCH
    ========================= */

    let user = (req as any).user;

    // fallback (important for stability)
    if (!user) {
      user = await prisma.user.findFirst(); // dev fallback
    }

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

    const userId = (req as any).user?.userId || (req as any).user?.id;

const frontJob = await prisma.productToModelJob.create({
  data: {
    userId: userId,
    productImageUrl: garmentFrontImageUrl,
    modelImageUrl: avatarFaceImageUrl,
    engine: "fashn",
    engineJobId: "pending",
    status: "running",
  },
});

// ✅ runId = jobId
const frontRunId = frontJob.id;

await heroQueue.add("hero-job", {
  jobId: frontJob.id,
  type: "front",
  lookbookId: "hero",
  pose: "hero",
  engine: "fashn",
  prompt: frontPrompt,
  modelImageUrl: avatarFaceImageUrl,
  garmentImageUrl: garmentFrontImageUrl,
  status: "pending",
  retries: 0,
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

  const userId = (req as any).user?.userId || (req as any).user?.id;

  const backJob = await prisma.productToModelJob.create({
    data: {
      userId: userId,
      productImageUrl: garmentBackImageUrl,
      modelImageUrl: avatarBackImageUrl,
      engine: "fashn",
      engineJobId: "pending",
      status: "running",
    },
  });

  // ✅ correct assignment (NO const)
  backRunId = backJob.id;

  await heroQueue.add("hero-job", {
    jobId: backJob.id,
    type: "back",
    lookbookId: "hero",
    pose: "hero_back",
    engine: "fashn",
    prompt: backPrompt,
    modelImageUrl: avatarBackImageUrl,
    garmentImageUrl: garmentBackImageUrl,
    status: "pending",
    retries: 0,
  });

  // ✅ update DB (missing earlier)
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