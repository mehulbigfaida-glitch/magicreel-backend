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
        userId: String(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: String(userId),
      },
      select: {
        paymentId: true,
        pdfUrl: true,
      },
    });

    const invoiceMap = new Map(
      invoices.map((i) => [i.paymentId, i.pdfUrl])
    );

    console.log("Payments:", payments);

    console.log("Invoices:", invoices);

    console.log("Invoice Map:", [...invoiceMap.entries()]);
    
    console.log("✅ Payments found:", payments.length);
    console.log("✅ Invoices found:", invoices.length);

    const safePayments = payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      invoiceUrl:
  p.razorpayPaymentId
    ? invoiceMap.get(p.razorpayPaymentId) ?? null
    : null,
    }));

    return res.json({
      success: true,
      data: safePayments,
    });
  } catch (error: any) {
    console.error("❌ Payment history error:", error.message);
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
};