import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { Prisma } from "@prisma/client";

import {
  prisma,
} from "../../magicreel/db/prisma";

import {
  calculateCreditValidityEnd,
} from "../../subscription/subscription.utils";

import {
  generateInvoiceForPayment,
} from "../../magicreel/services/invoice.service";

import {
  CREDIT_RATES,
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

export const verifyCreditTopup =
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
      // RAZORPAY ORDER
      // =====================================================

      const order =
        await razorpay.orders.fetch(
          razorpay_order_id
        );

      const notes =
        (order as any).notes || {};

      if (
        notes.kind !==
        "CREDIT_TOPUP"
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

      const requestedCredits =
        Number(
          notes.credits
        );

      const plan =
        notes.plan as
          | "BASIC"
          | "PRO"
          | "ADVANCE";

      if (
        !Number.isInteger(
          requestedCredits
        ) ||
        requestedCredits < 10 ||
        requestedCredits % 10 !== 0
      ) {
        return res.status(400).json({
          error:
            "Invalid top-up credits",
        });
      }

      const rate =
        CREDIT_RATES[plan];

      if (!rate) {
        return res.status(400).json({
          error:
            "Invalid top-up plan",
        });
      }

      const expectedAmount =
        withGST(
          requestedCredits *
            rate *
            100
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
      // ATOMIC SETTLEMENT
      // =====================================================

      const creditsValidUntil =
        calculateCreditValidityEnd(
          new Date()
        );

      await prisma.$transaction(
        async (tx) => {

          await tx.user.update({
            where: {
              id: userId,
            },

            data: {

              creditsAvailable: {
                increment:
                  requestedCredits,
              },

              creditsValidUntil,
            },
          });

          await tx.creditTransaction.create({
            data: {

              userId,

              credits:
                requestedCredits,

              feature:
                "CREDIT_TOPUP",

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

              plan:
                "CREDIT_TOPUP",

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
          "⚠️ CREDIT TOP-UP INVOICE FAILED:",
          invoiceError
        );

      }

      return res.json({
        success:
          true,

        message:
          "Credit top-up verified and credits added.",

        creditsAdded:
          requestedCredits,

        creditsValidUntil:
          creditsValidUntil.toISOString(),
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
        "❌ CREDIT TOP-UP VERIFY ERROR:",
        error
      );

      return res.status(500).json({
        error:
          "Credit top-up verification failed",
      });

    }

  };
