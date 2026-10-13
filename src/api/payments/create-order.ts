import { Request, Response } from "express";
import {
  isBusinessProfileComplete,
} from "../../business-profile/businessProfile.service";
import {
  isDomesticBillingComplete,
} from "../../billing/billingProfile.service";
import Razorpay from "razorpay";

import {
  PLAN_CONFIG,
  withGST,
} from "./paymentConfig";

function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("RAZORPAY_NOT_CONFIGURED");
  }

  return new Razorpay({ key_id, key_secret });
}

type PlanType =
  | "BASIC"
  | "PRO"
  | "ADVANCE";

export const createOrder =
  async (
    req: Request,
    res: Response
  ) => {

    try {
      const razorpay = getRazorpayClient();

      const plan =
        req.body?.plan as PlanType;

      const userId =
        (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          error:
            "Unauthorized",
        });
      }

      const businessProfileComplete =
        await isBusinessProfileComplete(
          userId
        );

      if (!businessProfileComplete) {
        return res.status(409).json({
          error:
            "BUSINESS_PROFILE_REQUIRED",
        });
      }

      const billingComplete =
        await isDomesticBillingComplete(
          userId
        );

      if (!billingComplete) {
        return res.status(409).json({
          error:
            "BILLING_PROFILE_REQUIRED",
        });
      }

      if (
        !plan ||
        !PLAN_CONFIG[plan]
      ) {
        return res.status(400).json({
          error:
            "Invalid plan",
        });
      }

      const baseAmount =
        PLAN_CONFIG[
          plan
        ].baseAmountPaise;

      const amount =
        withGST(baseAmount);

      const order =
        await razorpay.orders.create({
          amount,

          currency:
            "INR",

          receipt:
            `plan_${Date.now()
              .toString()
              .slice(-8)}`,

          notes: {
            kind:
              "PLAN_PURCHASE",

            userId,

            plan,
          },
        });

      return res.json({
        success:
          true,

        orderId:
          order.id,

        amount:
          order.amount,

        currency:
          order.currency,

        key: process.env.RAZORPAY_KEY_ID,
      });

    } catch (error: any) {

      console.error(
        "❌ RAZORPAY PLAN ORDER ERROR:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to create order",

        message:
          error?.message,
      });

    }

  };
