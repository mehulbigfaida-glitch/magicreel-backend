import { Request, Response } from "express";
import crypto from "crypto";

// ⚠️ Replace this with your DB access layer (Supabase / Prisma etc.)
const processedPayments = new Set<string>();

const PLAN_CONFIG: Record<string, { credits: number }> = {
  BASIC: { credits: 10 },
  PRO: { credits: 48 },
  ADVANCE: { credits: 105 },
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !plan
    ) {
      return res.status(400).json({ error: "Missing payment data" });
    }

    // 🔐 STEP 1 — SIGNATURE VERIFICATION
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // 🚫 STEP 2 — PREVENT DUPLICATE PAYMENTS
    if (processedPayments.has(razorpay_payment_id)) {
      return res.status(400).json({ error: "Payment already processed" });
    }

    processedPayments.add(razorpay_payment_id);

    // 🎯 STEP 3 — GET PLAN CREDITS
    const planConfig = PLAN_CONFIG[plan];

    if (!planConfig) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ✅ STEP 4 — CALL EXISTING BILLING LOGIC
    // IMPORTANT: we are NOT rewriting your billing system
    // We just simulate internal call

    const upgradeResponse = await fetch(
      `${process.env.BACKEND_URL}/api/billing/upgrade`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization || "",
        },
        body: JSON.stringify({
          credits: planConfig.credits,
          source: "razorpay",
          reference_id: razorpay_payment_id,
        }),
      }
    );

    const upgradeData = await upgradeResponse.json();

    if (!upgradeResponse.ok) {
      return res.status(500).json({
        error: "Payment verified but credit failed",
        details: upgradeData,
      });
    }

    // ✅ SUCCESS
    return res.json({
      success: true,
      message: "Payment verified and credits added",
      data: upgradeData,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};