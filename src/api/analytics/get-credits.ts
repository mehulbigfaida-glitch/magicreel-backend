import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getCreditsAnalytics = async (req: Request, res: Response) => {
  try {
    let user = (req as any).user;

// ✅ TEMP: force correct user
if (!user) {
  user = {
    id: "PASTE_USER_ID_FROM_DB_HERE"
  };
}

if (!user || !user.id) {
  return res.status(401).json({
    error: "Unauthorized",
  });
}

    const userId = user.id;

    /* ----------------------------------
       🔥 FETCH TRANSACTIONS
    ---------------------------------- */

    const transactions = await prisma.creditTransaction.findMany({
      where: {
        userId,
        type: "DEBIT",
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /* ----------------------------------
       📊 TOTAL CREDITS USED
    ---------------------------------- */

    const totalCreditsUsed = transactions.reduce(
      (sum, tx) => sum + tx.credits,
      0
    );

    /* ----------------------------------
       📊 GROUP BY FEATURE
    ---------------------------------- */

    const byFeature: Record<string, number> = {};

    for (const tx of transactions) {
      if (!byFeature[tx.feature]) {
        byFeature[tx.feature] = 0;
      }
      byFeature[tx.feature] += tx.credits;
    }

    /* ----------------------------------
       📊 RECENT (LIMIT 10)
    ---------------------------------- */

    const recentTransactions = transactions.slice(0, 10).map((tx) => ({
      id: tx.id,
      feature: tx.feature,
      credits: tx.credits,
      predictionId: tx.predictionId,
      createdAt: tx.createdAt,
    }));

    return res.json({
      totalCreditsUsed,
      byFeature,
      recentTransactions,
    });

  } catch (error) {
    console.error("❌ Analytics error:", error);
    return res.status(500).json({
      error: "Failed to fetch analytics",
    });
  }
};