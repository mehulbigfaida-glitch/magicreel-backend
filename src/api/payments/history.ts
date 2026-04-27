import { Request, Response } from "express";
import { prisma } from "../../magicreel/db/prisma";

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("❌ Payment history error:", error);
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
};