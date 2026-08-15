import { Request, Response } from "express";

import { prisma } from "../../magicreel/db/prisma";

import {
  generateSocialPackExecutor,
} from "../../magicreel/fashion-intelligence/social-pack/socialPackExecutor";

/* =========================================================
   TEMP BILLING
   ---------------------------------------------------------
   Kept unchanged intentionally.
   Portfolio persistence is the current objective.
========================================================= */

async function getUserCredits(userId: string) {
  return 100;
}

async function deductCredits(
  userId: string,
  amount: number
) {
  console.log(
    `Deducting ${amount} credits from ${userId}`
  );
}

/* =========================================================
   CONTROLLER
========================================================= */

export async function generateSocialPack(
  req: Request,
  res: Response
) {
  try {
    const {
      outputs,
      inputs,
    } = req.body;

    /* =====================================================
       AUTHENTICATED USER
    ===================================================== */

    const userId =
      (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    /* ================= VALIDATION ================= */

    if (
      !outputs ||
      !Array.isArray(outputs) ||
      outputs.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "No outputs selected",
      });
    }

    /* ================= CREDIT CHECK ================= */

    const credits =
      await getUserCredits(userId);

    if (credits < outputs.length) {
      return res.status(400).json({
        success: false,
        error: "Not enough credits",
      });
    }

    /* ================= GENERATION ================= */

    const {
      results,
      successCount,
    } =
      await generateSocialPackExecutor({
        outputs,
        inputs,
      });

    /* =====================================================
       PERSIST SUCCESSFUL SOCIAL CREATIVES
       -----------------------------------------------------
       One generated creative = one Portfolio record.
    ===================================================== */

    const successfulResults =
      Object.entries(results)
        .filter(
          ([, imageUrl]) =>
            typeof imageUrl === "string" &&
            imageUrl.length > 0
        );

    for (
      const [creativeGoal, imageUrl]
      of successfulResults
    ) {

      await prisma.socialGeneration.create({
        data: {
          userId,

          creativeGoal,

          heroImageUrl:
            inputs?.heroImage ||
            null,

          imageUrl,

          status:
            "COMPLETED",
        },
      });
    }

    /* ================= BILLING ================= */

    if (successCount > 0) {
      await deductCredits(
        userId,
        successCount
      );
    }

    /* ================= RESPONSE ================= */

    return res.json({
      success: true,

      results,
    });

  } catch (err: any) {

    console.error(
      "SOCIAL PACK ERROR:",
      err
    );

    return res.status(500).json({
      success: false,

      error:
        err?.message ||
        "Unknown error",

      stack:
        err?.stack,
    });
  }
}