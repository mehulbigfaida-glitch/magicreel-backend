import { Request, Response } from "express";
import crypto from "crypto";
const Razorpay = require("razorpay");

// 🔒 Ensure env is present at startup
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys are missing in environment variables");
}

// 🔧 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🎯 Strongly typed plans
type PlanType = "BASIC" | "PRO" | "ADVANCE";

const PLAN_CONFIG: Record<PlanType, { amount: number; credits: number }> = {
  BASIC: { amount: 90000, credits: 10 },
  PRO: { amount: 360000, credits: 48 },
  ADVANCE: { amount: 630000, credits: 105 },
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body as { plan: PlanType };

    // 🔐 Enforce authentication (NO guest payments)
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ❌ Invalid plan protection
    if (!plan || !PLAN_CONFIG[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const { amount } = PLAN_CONFIG[plan];

    // 🧠 Unique receipt (prevents collisions)
    const receipt = `rcpt_${userId}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        plan,
        userId,
      },
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // safe to expose
      plan,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
};