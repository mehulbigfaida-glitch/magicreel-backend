import { Request, Response } from "express";
import Razorpay from "razorpay";

import {
  PLAN_CONFIG,
  withGST,
} from "./paymentConfig";

const key_id =
  process.env.RAZORPAY_KEY_ID;

const key_secret =
  process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: key_id!,
  key_secret: key_secret!,
});

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

        key:
          key_id,
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
