import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { Prisma } from "@prisma/client";

import { prisma } from "../../magicreel/db/prisma";

import {
  generateInvoiceForPayment,
} from "../../magicreel/services/invoice.service";

import {
  PLAN_CONFIG,
  withGST,
} from "./paymentConfig";

import {
  SubscriptionService,
} from "../../subscription/subscription.service";

import {
  calculateCreditValidityEnd,
  calculateSubscriptionEnd,
} from "../../subscription/subscription.utils";

const key_id =
  process.env.RAZORPAY_KEY_ID;

const key_secret =
  process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: key_id!,
  key_secret: key_secret!,
});

export const verifyPayment =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      const userId =
        (req as any).user?.id;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          error:
            "Missing payment data",
        });
      }

      if (!userId) {
        return res.status(401).json({
          error:
            "Unauthorized",
        });
      }

      // =====================================================
      // SIGNATURE
      // =====================================================

      const body =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET!
          )
          .update(body)
          .digest("hex");

      if (
        expectedSignature !==
        razorpay_signature
      ) {
        return res.status(400).json({
          error:
            "Invalid payment signature",
        });
      }

      // =====================================================
      // RAZORPAY ORDER — SERVER AUTHORITY
      // =====================================================

      const order =
        await razorpay.orders.fetch(
          razorpay_order_id
        );

      const notes =
        (order as any).notes || {};

      const plan =
        notes.plan as "PRO";

      if (
        notes.kind !==
        "PLAN_PURCHASE"
      ) {
        return res.status(400).json({
          error:
            "Invalid payment type",
        });
      }

      if (
        notes.userId !==
        userId
      ) {
        return res.status(403).json({
          error:
            "Payment does not belong to current user",
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

      const expectedAmount =
        withGST(
          PLAN_CONFIG[plan]
            .baseAmountPaise
        );

      if (
        Number(order.amount) !==
        expectedAmount
      ) {
        return res.status(400).json({
          error:
            "Payment amount mismatch",
        });
      }

      if (
        order.currency !==
        "INR"
      ) {
        return res.status(400).json({
          error:
            "Invalid payment currency",
        });
      }

      // =====================================================
      // DATABASE IDEMPOTENCY
      // =====================================================

      const existing =
        await prisma.payment.findUnique({
          where: {
            razorpayPaymentId:
              razorpay_payment_id,
          },
        });

      if (existing) {

        if (
          existing.userId !==
          userId
        ) {
          return res.status(403).json({
            error:
              "Payment belongs to another user",
          });
        }

        return res.json({
          success:
            true,

          message:
            "Payment already processed",
        });
      }

      // =====================================================
      // ATOMIC CREDIT + PAYMENT SETTLEMENT
      // =====================================================

      const credits =
        PLAN_CONFIG[
          plan
        ].credits;

      await prisma.$transaction(
        async (tx) => {

          const user =
            await tx.user.findUnique({
              where: {
                id: userId,
              },

              select: {
                subscriptionEnd:
                  true,
              },
            });

          if (!user) {
            throw new Error(
              "User not found"
            );
          }

          const now =
            new Date();

          const subscriptionStillActive =
            !!user.subscriptionEnd &&
            user.subscriptionEnd > now;

          const updateData:
            Prisma.UserUpdateInput = {

            plan,

            isPaid:
              true,

            creditsAvailable: {
              increment:
                credits,
            },

          };

          updateData.creditsValidUntil =
            calculateCreditValidityEnd(
              now
            );

          if (
            !subscriptionStillActive
          ) {

            updateData.subscriptionType =
              "MONTHLY";

            updateData.subscriptionStart =
              now;

            updateData.subscriptionEnd =
              calculateSubscriptionEnd(
                now
              );

          }

          await tx.user.update({
            where: {
              id: userId,
            },

            data:
              updateData,
          });

          await tx.creditTransaction.create({
            data: {

              userId,

              credits,

              feature:
                "PLAN_UPGRADE",

              type:
                "CREDIT",

              status:
                "COMPLETED",

              referenceId:
                razorpay_payment_id,
            },
          });

          await tx.payment.create({
            data: {

              userId,

              plan,

              amount:
                expectedAmount,

              razorpayOrderId:
                razorpay_order_id,

              razorpayPaymentId:
                razorpay_payment_id,

              status:
                "SUCCESS",
            },
          });

        }
      );

      // =====================================================
      // INVOICE
      // =====================================================

      try {

        await generateInvoiceForPayment({
          userId,

          razorpayPaymentId:
            razorpay_payment_id,
        });

      } catch (
        invoiceError
      ) {

        console.error(
          "⚠️ INVOICE GENERATION FAILED:",
          invoiceError
        );

      }

      return res.json({
        success:
          true,

        message:
          "Payment verified and credits added",

        plan,

        creditsAdded:
          credits,
      });

    } catch (error: any) {

      if (
        error instanceof
        Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {

        return res.json({
          success:
            true,

          message:
            "Payment already processed",
        });

      }

      console.error(
        "❌ Verify Payment Error:",
        error
      );

      return res.status(500).json({
        error:
          "Payment verification failed",
      });

    }

  };
