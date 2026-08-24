import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { Prisma } from "@prisma/client";

import {
  prisma,
} from "../../magicreel/db/prisma";

import {
  generateInvoiceForPayment,
} from "../../magicreel/services/invoice.service";

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

function calculatePublishingEnd(
  startDate: Date
): Date {

  const end =
    new Date(startDate);

  end.setDate(
    end.getDate() + 30
  );

  end.setMilliseconds(
    end.getMilliseconds() - 1
  );

  return end;
}

export const verifyPublishing =
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
        "PUBLISHING"
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

      const expectedAmount =
        withGST(
          PUBLISHING_BASE_AMOUNT_PAISE
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
      // ACTIVATE / EXTEND PUBLISHING
      // =====================================================

      const now =
        new Date();

      await prisma.$transaction(
        async (tx) => {

          const user =
            await tx.user.findUnique({
              where: {
                id: userId,
              },

              select: {
                publishingSubscriptionEnd:
                  true,
              },
            });

          if (!user) {
            throw new Error(
              "User not found"
            );
          }

          const currentEnd =
            user.publishingSubscriptionEnd;

          const active =
            !!currentEnd &&
            currentEnd > now;

          const newEnd =
            active
              ? (() => {
                  const extended =
                    new Date(
                      currentEnd
                    );

                  extended.setDate(
                    extended.getDate() +
                      30
                  );

                  return extended;
                })()
              : calculatePublishingEnd(
                  now
                );

          await tx.user.update({
            where: {
              id: userId,
            },

            data: {

              publishingSubscriptionStart:
                active
                  ? undefined
                  : now,

              publishingSubscriptionEnd:
                newEnd,
            },
          });

          await tx.payment.create({
            data: {

              userId,

              plan:
                "PUBLISHING",

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
          "⚠️ PUBLISHING INVOICE FAILED:",
          invoiceError
        );

      }

      return res.json({
        success:
          true,

        message:
          "Publishing subscription activated.",

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
        "❌ PUBLISHING VERIFY ERROR:",
        error
      );

      return res.status(500).json({
        error:
          "Publishing subscription verification failed",
      });

    }

  };
