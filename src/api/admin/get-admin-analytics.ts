import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: string };

if (!user || !user.id) {
  return res.status(401).json({ error: "Unauthorized" });
}

// 🔒 ADMIN CHECK
if (user.id !== "f859ac9b-96d5-4af1-81fc-401428d6bda4") {
  return res.status(403).json({ error: "Forbidden" });
}

    /* ----------------------------------
       👥 TOTAL USERS
    ---------------------------------- */

    const totalUsers = await prisma.user.count();

    /* ----------------------------------
       💰 TOTAL CREDITS CONSUMED
    ---------------------------------- */

    const transactions = await prisma.creditTransaction.findMany({
      where: {
        type: "DEBIT",
        status: "COMPLETED",
      },
    });

    const totalCreditsConsumed = transactions.reduce(
      (sum, tx) => sum + tx.credits,
      0
    );

    /* ----------------------------------
       📊 FEATURE BREAKDOWN
    ---------------------------------- */

    const featureBreakdown: Record<string, number> = {};

    for (const tx of transactions) {
      if (!featureBreakdown[tx.feature]) {
        featureBreakdown[tx.feature] = 0;
      }
      featureBreakdown[tx.feature] += tx.credits;
    }

    return res.json({
      totalUsers,
      totalCreditsConsumed,
      featureBreakdown,
    });

  } catch (error) {
    console.error("❌ Admin analytics error:", error);
    return res.status(500).json({
      error: "Failed to fetch admin analytics",
    });
  }
};