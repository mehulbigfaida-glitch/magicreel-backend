import { Request, Response } from "express";
import crypto from "crypto";
import { upgradePlan } from "../../billing/upgrade";

const processedPayments = new Set<string>();

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    const userId = (req as any).user?.id;

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

    // 🔐 STEP 1 — VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch");
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // 🚫 STEP 2 — PREVENT DUPLICATE
    if (processedPayments.has(razorpay_payment_id)) {
      return res.status(400).json({ error: "Payment already processed" });
    }

    processedPayments.add(razorpay_payment_id);

    // 🎯 STEP 3 — CALL BILLING DIRECTLY (NO FETCH)
    await upgradePlan(
      {
        body: { plan },
        user: { id: userId },
      } as any,
      {
        status: () => ({ json: () => {} }),
      } as any
    );

    // ✅ SUCCESS
    return res.json({
      success: true,
      message: "Payment verified and credits added",
    });

  } catch (error) {
    console.error("❌ Verify Payment Error:", error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};