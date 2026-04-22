import { Request, Response } from "express";
import { reelV1Service } from "../../../magicreel/services/reelV1.service";
import { prisma } from "../../../magicreel/db/prisma";
import { finalizeBilling } from "../../../billing/billing.middleware";
import { checkCreditsOrThrow } from "../../../billing/billing.middleware";

export async function generateReelV1Controller(
  req: Request,
  res: Response
) {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: "imageUrl is required",
      });
    }

    /* ----------------------------------
       💳 CREDIT CHECK
    ---------------------------------- */
    await checkCreditsOrThrow(req, 3);

    /* ----------------------------------
       🎬 GENERATE REEL
    ---------------------------------- */
    const result = await reelV1Service.generate({ imageUrl });

    /* ----------------------------------
       💾 CREATE RENDER (CRITICAL FIX)
    ---------------------------------- */
    const render = await prisma.render.create({
      data: {
        outputImageUrl: null,
        reelVideoUrl: result.reelVideoUrl,
        type: "REEL",
        status: "completed",
        pose: "REEL",
        engine: "KLING_V2",
        modelImageUrl: imageUrl,
        garmentImageUrl: imageUrl,
        lookbook: {
          connect: {
            id: "lookbook-default-1",
          },
        },
      },
    });

    /* ----------------------------------
       💰 BILLING (LINKED)
    ---------------------------------- */
    if (render?.id) {
      (req as any).billing = {
        ...(req as any).billing,
        predictionId: render.id,
      };
    }

    try {
      await finalizeBilling(req);
    } catch (e) {
      console.error("Reel billing failed:", e);
    }

    /* ----------------------------------
       ✅ RESPONSE
    ---------------------------------- */
    return res.status(200).json({
      success: true,
      reelVideoUrl: result.reelVideoUrl,
      runId: result.predictionId,
    });

  } catch (error: any) {
    console.error("❌ Reel V1 Error:", error);

    if (error.code === "INSUFFICIENT_CREDITS") {
      return res.status(400).json({
        success: false,
        error: "INSUFFICIENT_CREDITS",
        required: error.required,
        available: error.available,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Reel generation failed",
    });
  }
}