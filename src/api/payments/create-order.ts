import { Request, Response } from "express";
import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

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
    console.log("🟡 CREATE ORDER HIT");

    const { plan } = req.body as { plan: PlanType };
    const userId = (req as any).user?.id;

    console.log("➡️ Plan:", plan);
    console.log("➡️ User:", userId);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!plan || !PLAN_CONFIG[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const { amount } = PLAN_CONFIG[plan];

    console.log("💰 Amount:", amount);

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${userId}_${Date.now()}`,
    });

    console.log("✅ ORDER CREATED:", order.id);

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: key_id,
    });

  } catch (error: any) {
    console.error("❌ RAZORPAY FULL ERROR:");
    console.error(error);
    console.error("❌ MESSAGE:", error?.message);
    console.error("❌ STACK:", error?.stack);

    return res.status(500).json({
      error: "Failed to create order",
      message: error?.message,
    });
  }
};