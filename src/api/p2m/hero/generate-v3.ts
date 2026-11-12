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
      bodyType: requestedBodyType,
    } = req.body;

    const allowedBodyTypes = ["Slim", "Athletic", "Curvy", "Plus Size"] as const;
    const bodyType = allowedBodyTypes.includes(requestedBodyType)
      ? requestedBodyType
      : "Athletic";

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

    let user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const userId = user.userId || user.id;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        creditsAvailable: true,
      },
    });

    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (dbUser.creditsAvailable <= 0) {
      return res.status(403).json({
        error: "No credits left",
      });
    }

    // One body-type selection governs BOTH views. The rear view must not
    // infer a different physique from the head/neck reference image.
    const sharedBodyTypeInstruction = `
BODY TYPE CONSISTENCY — FRONT AND BACK VIEWS

The selected body type for this paired front-and-back product shoot is: ${bodyType}.

This selection is fixed and must be followed exactly for this image.
The front and back images represent the SAME fashion model and the SAME body type.
For the back view, recreate the same overall body build and silhouette used for the front view: consistent shoulder width, torso volume, waist definition, hip width, and leg proportions appropriate to the selected body type.
Do not make the back-view model slimmer, fuller, more athletic, or otherwise different from the selected body type.
The uploaded Muse image is a face/identity reference only. It does not determine body shape.
Generate the full body according to the selected body type, not according to the headshot crop.
`.trim();

    console.log("=== HERO REQUEST ===", {
      categoryKey,
      avatarGender,
      styling,
      bodyType,
    });

    const frontPrompt = `${buildGptHeroPrompt({
      categoryKey,
      avatarGender,
      styling,
      bodyType,
      heroView: "front",
    })}

${sharedBodyTypeInstruction}`;

    console.log("Front prompt built:", frontPrompt.length, "characters");
    console.log("=== FRONT HERO PROMPT ===");
    console.log(frontPrompt);

    const frontJob = await prisma.productToModelJob.create({
      data: {
        userId,
        productImageUrl: garmentFrontImageUrl,
        modelImageUrl: avatarFaceImageUrl,
        engine: "gpt-image-2.5-sunburst",
        engineJobId: "pending",
        status: "running",
        avatarGender,
        categoryKey,
      },
    });

    (req as any).billing.predictionId = frontJob.id;

    const frontResult = await gptHeroProvider.generateHero({
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

      const backPrompt = `${buildGptHeroPrompt({
        categoryKey,
        avatarGender,
        styling,
        bodyType,
        heroView: "back",
      })}

${sharedBodyTypeInstruction}`;

      const backJob = await prisma.productToModelJob.create({
        data: {
          userId,
          productImageUrl: garmentBackImageUrl,
          modelImageUrl: avatarBackImageUrl,
          // Keep the recorded engine consistent with the GPT Image 2.5
          // Sunburst provider used for both hero views.
          engine: "gpt-image-2.5-sunburst",
          engineJobId: "pending",
          status: "running",
          avatarGender,
          categoryKey: backCategoryKey,
        },
      });

      const backResult = await gptHeroProvider.generateHero({
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

    // Billing remains attached to the front job as in the existing flow.
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
