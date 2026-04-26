import { Request, Response } from "express";
import Razorpay from "razorpay";

// 🔐 Validate env at runtime
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.error("❌ Razorpay ENV missing");
}

const razorpay = new Razorpay({
  key_id: key_id!,
  key_secret: key_secret!,
});

type PlanType = "BASIC" | "PRO" | "ADVANCE";

const PLAN_CONFIG: Record<PlanType, { amount: number }> = {
  BASIC: { amount: 90000 },
  PRO: { amount: 360000 },
  ADVANCE: { amount: 630000 },
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body as { plan: PlanType };

    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!plan || !PLAN_CONFIG[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const { amount } = PLAN_CONFIG[plan];

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${userId}_${Date.now()}`,
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: key_id,
    });

  } catch (error: any) {
    console.error("❌ CREATE ORDER ERROR:", error);

    return res.status(500).json({
      error: "Failed to create order",
      details: error?.message || error,
    });
  }
};