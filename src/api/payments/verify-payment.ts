import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../../magicreel/db/prisma";

const processedPayments = new Set<string>();

const PLAN_CREDITS: Record<string, number> = {
  BASIC: 10,
  PRO: 48,
  ADVANCE: 105,
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    const userId = (req as any).user?.id;

    console.log("🔥 USER ID:", userId);

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !plan
    ) {
      return res.status(400).json({ error: "Missing payment data" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch");
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // 🚫 DUPLICATE CHECK
    if (processedPayments.has(razorpay_payment_id)) {
      return res.status(400).json({ error: "Payment already processed" });
    }

    processedPayments.add(razorpay_payment_id);

    // 🎯 GET PLAN CREDITS
    const creditsToAdd = PLAN_CREDITS[plan];

    if (!creditsToAdd) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    // ✅ UPDATE USER CREDITS
    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsAvailable: {
          increment: creditsToAdd,
        },
        plan: plan,
      },
    });

    // ✅ LOG CREDIT TRANSACTION (optional but good)
    await prisma.creditTransaction.create({
      data: {
        userId: userId,
        credits: creditsToAdd,
        feature: "PLAN_UPGRADE",
        status: "COMPLETED",
      },
    });

    // ✅ SAVE PAYMENT (NOW FK WILL PASS)
    await prisma.payment.create({
      data: {
        userId: userId,
        plan: plan,
        amount:
          plan === "BASIC"
            ? 90000
            : plan === "PRO"
            ? 360000
            : 630000,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: "SUCCESS",
      },
    });

    console.log("🔥 PAYMENT STORED SUCCESSFULLY");

    return res.json({
      success: true,
      message: "Payment verified and credits added",
    });

  } catch (error: any) {
    console.error("❌ Verify Payment Error:", error.message, error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};