import { Request, Response } from "express";
import { reelV1Service } from "../../../magicreel/services/reelV1.service";
import { prisma } from "../../../magicreel/db/prisma";

export async function generateReelV1Controller(
  req: Request,
  res: Response
) {
  try {
    const { imageUrl } = req.body;

    const billing = (req as any).billing;

    if (!billing) {
      return res.status(400).json({
        success: false,
        error: "Billing not initialized",
      });
    }

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
       DEDUCT CREDIT (DYNAMIC)
    ---------------------------------- */

    await prisma.$transaction([
      prisma.user.update({
        where: { id: billing.userId },
        data: {
          creditsAvailable: {
            decrement: billing.creditsRequired,
          },
        },
      }),

      prisma.creditTransaction.create({
        data: {
          user: {
            connect: { id: billing.userId },
          },
          feature: billing.feature,
          credits: billing.creditsRequired,
          type: "DEBIT",
          status: "COMPLETED",
        },
      }),
    ]);

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