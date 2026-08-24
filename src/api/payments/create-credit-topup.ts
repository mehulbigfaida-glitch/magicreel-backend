import { Request, Response } from "express";
import Razorpay from "razorpay";

import {
  CREDIT_RATES,
  withGST,
} from "./paymentConfig";

import { prisma } from "../../magicreel/db/prisma";
import {
  isBusinessProfileComplete,
} from "../../business-profile/businessProfile.service";
import {
  isDomesticBillingComplete,
} from "../../billing/billingProfile.service";

const key_id =
  process.env.RAZORPAY_KEY_ID;

const key_secret =
  process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: key_id!,
  key_secret: key_secret!,
});

export const createCreditTopupOrder =
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

      const credits =
        Number(
          req.body?.credits
        );

      if (
        !Number.isInteger(
          credits
        ) ||
        credits < 10 ||
        credits % 10 !== 0
      ) {
        return res.status(400).json({
          error:
            "Credits must be a positive multiple of 10 with a minimum of 10 credits.",
        });
      }

      const user =
        await prisma.user.findUnique({
          where: {
            id: userId,
          },

          select: {
            plan: true,
          },
        });

      if (!user) {
        return res.status(404).json({
          error:
            "User not found",
        });
      }

      const rate =
        CREDIT_RATES[
          user.plan as
            | "BASIC"
            | "PRO"
            | "ADVANCE"
        ];

      if (!rate) {
        return res.status(400).json({
          error:
            "Credit top-ups are available only for BASIC, PRO and ADVANCE plans.",
        });
      }

      const baseAmountPaise =
        credits *
        rate *
        100;

      const amount =
        withGST(
          baseAmountPaise
        );

      const order =
        await razorpay.orders.create({
          amount,

          currency:
            "INR",

          receipt:
            `topup_${Date.now()
              .toString()
              .slice(-8)}`,

          notes: {

            kind:
              "CREDIT_TOPUP",

            userId,

            plan:
              user.plan,

            credits:
              String(credits),

            rate:
              String(rate),
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

        credits,

        ratePerCredit:
          rate,

        plan:
          user.plan,
      });

    } catch (error: any) {

      console.error(
        "❌ CREDIT TOP-UP ORDER ERROR:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to create credit top-up order",

        message:
          error?.message,
      });

    }

  };
