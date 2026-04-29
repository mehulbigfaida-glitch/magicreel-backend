import { prisma } from "../../lib/prisma";
import { generateInvoicePDF } from "../services/invoicePdf.service";
import fs from "fs";
import path from "path";

const COMPANY_STATE = "Maharashtra";
const GST_RATE = 18;

export async function generateInvoiceForPayment({
  userId,
  razorpayPaymentId,
}: {
  userId: string;
  razorpayPaymentId: string;
}) {
  // 1. Prevent duplicate invoice
  const existing = await prisma.invoice.findUnique({
    where: { paymentId: razorpayPaymentId },
  });

  if (existing) return existing;

  // 2. Get payment
  const payment = await prisma.payment.findUnique({
    where: { razorpayPaymentId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // 3. FREE plan guard
  if (Number(payment.amount) <= 0) {
    return null;
  }

  // 4. Get user profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("User profile not found");
  }

  // 5. Generate invoice number
  const year = new Date().getFullYear();

  const sequence = await prisma.$transaction(async (tx) => {
    let seq = await tx.invoiceSequence.findUnique({
      where: { year },
    });

    if (!seq) {
      seq = await tx.invoiceSequence.create({
        data: {
          year,
          lastNumber: 1,
        },
      });
    } else {
      seq = await tx.invoiceSequence.update({
        where: { year },
        data: {
          lastNumber: { increment: 1 },
        },
      });
    }

    return seq;
  });

  const invoiceNumber = `MR-${year}-${String(sequence.lastNumber).padStart(6, "0")}`;

  // 6. GST Calculation
  const amount = Number(payment.amount); // paise

  const base = Math.round(amount / (1 + GST_RATE / 100));
  const gstAmount = amount - base;

  let cgst = null;
  let sgst = null;
  let igst = null;

  if (profile.state === COMPANY_STATE) {
    cgst = Math.round(gstAmount / 2);
    sgst = Math.round(gstAmount / 2);
  } else {
    igst = gstAmount;
  }

  // 7. Create invoice
  const invoice = await prisma.invoice.create({
    data: {
      userId,
      paymentId: razorpayPaymentId,

      invoiceNumber,

      fullName: profile.fullName,
      companyName: profile.companyName,
      addressLine1: profile.addressLine1,
      addressLine2: profile.addressLine2,
      city: profile.city,
      state: profile.state,
      postalCode: profile.postalCode,
      country: profile.country,
      gstin: profile.gstin,

      planName: payment.plan,
      amount: amount,
      currency: "INR",

      gstRate: GST_RATE,
      cgst,
      sgst,
      igst,

      totalAmount: amount,
    },
  });

  // =========================
  // 8. PDF GENERATION (NEW)
  // =========================

  try {
    const pdfBuffer = await generateInvoicePDF({
      invoiceNo: invoice.invoiceNumber,
      date: new Date().toLocaleDateString("en-IN"),

      customerName:
        invoice.companyName || invoice.fullName || "Customer",

      customerAddress: [
        invoice.addressLine1,
        invoice.addressLine2,
        invoice.city,
        invoice.state,
        invoice.postalCode,
      ]
        .filter(Boolean)
        .join(", "),

      customerGSTIN: invoice.gstin || undefined,

      placeOfSupply: `${invoice.state} (${invoice.state === "Maharashtra" ? "27" : ""})`,

      description: `${invoice.planName} Plan`,

      amount: invoice.amount / 100,

      cgst: invoice.cgst ? invoice.cgst / 100 : undefined,
      sgst: invoice.sgst ? invoice.sgst / 100 : undefined,
      igst: invoice.igst ? invoice.igst / 100 : undefined,

      total: invoice.totalAmount / 100,
    });

    // Save locally (temporary)
    const filePath = path.join(
      process.cwd(),
      `invoice-${invoice.invoiceNumber}.pdf`
    );

    fs.writeFileSync(filePath, pdfBuffer);

    // Optional: you can store this later in DB
    return {
      ...invoice,
      pdfPath: filePath,
    };
  } catch (err) {
    console.error("PDF generation failed:", err);

    // Fail-safe: still return invoice if PDF fails
    return invoice;
  }
}