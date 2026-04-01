import { Request, Response } from "express";
import { reelV1Service } from "../../../magicreel/services/reelV1.service";
import { prisma } from "../../../magicreel/db/prisma";
import { finalizeBilling } from "../../../billing/billing.middleware"; // ✅ FIX

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

    if (!prisma) {
      return res.status(500).json({
        success: false,
        error: "Prisma not initialized",
      });
    }

    /* ----------------------------------
       GENERATE REEL
    ---------------------------------- */

    const result = await reelV1Service.generate({ imageUrl });

    /* ----------------------------------
       ✅ BILLING (UNIFIED SYSTEM)
    ---------------------------------- */

    try {
      await finalizeBilling(req); // ✅ SINGLE SOURCE
    } catch (e) {
      console.error("Reel billing failed:", e);
      // do not block response
    }

    return res.status(200).json({
      success: true,
      reelVideoUrl: result.reelVideoUrl,
    });

  } catch (error: any) {
    console.error("❌ Reel V1 Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Reel generation failed",
    });
  }
}