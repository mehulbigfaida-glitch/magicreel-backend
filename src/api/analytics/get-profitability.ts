import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getProfitability = async (req: Request, res: Response) => {
  try {
    // ✅ STRICT JWT USER (NO FALLBACK)
    const user = (req as any).user as { id: string };

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
    });

    /* ----------------------------------
       📊 BUILD PROFITABILITY MAP
    ---------------------------------- */

    const result: Record<
      string,
      { usage: number; creditsConsumed: number }
    > = {};

    for (const tx of transactions) {
      if (!result[tx.feature]) {
        result[tx.feature] = {
          usage: 0,
          creditsConsumed: 0,
        };
      }

      result[tx.feature].usage += 1;
      result[tx.feature].creditsConsumed += tx.credits;
    }

    return res.json(result);

  } catch (error) {
    console.error("❌ Profitability error:", error);
    return res.status(500).json({
      error: "Failed to fetch profitability data",
    });
  }
};