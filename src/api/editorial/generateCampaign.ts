import { Request, Response } from "express";

import {
  finalizeBilling,
} from "../../billing/billing.middleware";

import {
  generateEditorialDirection,
} from "../../magicreel/editorial/editorialDirectionGenerator";

import { prisma } from "../../magicreel/db/prisma";

export async function generateCampaign(
  req: Request,
  res: Response
) {
  try {
    const {
      editorialWorld,
      output,
      heroImageUrl,
      logoImageUrl,
    } = req.body;

    if (
      !editorialWorld ||
      !heroImageUrl
    ) {
      return res.status(400).json({
        error:
          "Missing editorialWorld, outputs, or heroImageUrl",
      });
    }

    const promptAssets = [
      {
        output,
      },
    ];

    const generatedAssets = [];

    for (const asset of promptAssets) {
      const generated =
        await generateEditorialDirection({
          heroImageUrl,

          logoImageUrl,

          additionalImageUrls:
            req.body.additionalImageUrls,

          editorialWorld,

          output:
            asset.output,
        });

      generatedAssets.push({
        output:
          asset.output,

        imageUrl:
          generated.imageUrl,

        prompt:
          generated.prompt,
      });
    }

    // ============================================
    // PERSIST EDITORIAL GENERATION
    // ============================================

    const userId =
      (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const editorialGeneration =
      await prisma.editorialGeneration.create({
        data: {
          userId,

          editorialWorld,

          output,

          heroImageUrl,

          imageUrl:
            generatedAssets[0].imageUrl,

          prompt:
            generatedAssets[0].prompt,

          status: "COMPLETED",
        },
      });

    // Deduct credits only after successful
    // generation and persistence.
    await finalizeBilling(req);

    return res.json({
      success: true,

      generationId:
        editorialGeneration.id,

      editorialWorld,

      assets:
        generatedAssets,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      error:
        error.message ||
        "Failed to generate campaign",
    });
  }
}