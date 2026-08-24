import { Request, Response } from "express";
import {
  isBusinessProfileComplete,
} from "../../business-profile/businessProfile.service";
import {
  isDomesticBillingComplete,
} from "../../billing/billingProfile.service";
import Razorpay from "razorpay";

import {
  PUBLISHING_BASE_AMOUNT_PAISE,
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

export const createPublishingOrder =
  async (
    req: Request,
    res: Response
  ) => {

    try {

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

      const amount =
        withGST(
          PUBLISHING_BASE_AMOUNT_PAISE
        );

      const order =
        await razorpay.orders.create({
          amount,

          currency:
            "INR",

          receipt:
            `publish_${Date.now()
              .toString()
              .slice(-8)}`,

          notes: {
            kind:
              "PUBLISHING",

            userId,
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
        "❌ PUBLISHING ORDER ERROR:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to create publishing subscription order",

        message:
          error?.message,
      });

    }

  };
