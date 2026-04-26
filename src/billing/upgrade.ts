import { Request, Response } from "express";
import { prisma } from "../magicreel/db/prisma";

export const upgradePlan = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🔐 CRITICAL SECURITY CHECK
    const isInternal = (req as any).isInternal === true;

    if (!isInternal) {
      return res.status(403).json({
        error: "Direct upgrade not allowed",
      });
    }

    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ error: "Plan required" });
    }

    // 🎯 MATCH YOUR UI
    const PLAN_CREDITS: Record<string, number> = {
      BASIC: 10,
      PRO: 48,
      ADVANCE: 105,
    };

    const creditsToAdd = PLAN_CREDITS[plan];

    if (!creditsToAdd) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    // ✅ ADD CREDITS (SAFE)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        creditsAvailable: {
          increment: creditsToAdd,
        },
        plan: plan,
      },
    });

    // ✅ LOG TRANSACTION
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        credits: creditsToAdd,
        feature: "PLAN_UPGRADE",
        status: "COMPLETED",
      },
    });

    return res.json({
      success: true,
      credits: updatedUser.creditsAvailable,
      plan: updatedUser.plan,
    });

  } catch (error) {
    console.error("Upgrade error:", error);
    return res.status(500).json({ error: "Upgrade failed" });
  }
};