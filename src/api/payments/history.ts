import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    console.log("🔥 Fetching payments for user:", userId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payments = await prisma.payment.findMany({
      where: {
        userId: String(userId), // 🔥 FORCE STRING MATCH
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("✅ Payments found:", payments.length);

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    console.error("❌ Payment history error:", error.message);
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
};