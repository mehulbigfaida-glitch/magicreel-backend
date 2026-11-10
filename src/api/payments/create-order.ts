import { Request, Response } from "express";
import { getRazorpayClient } from "./razorpayClient";

import {
  PLAN_CONFIG,
  withGST,
} from "./paymentConfig";

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
      const { client: razorpay, keyId, keySecret } = getRazorpayClient();


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
          keyId,
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
