import { prisma } from "../../lib/prisma"; 

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

  const count = await prisma.invoice.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
  });

  const invoiceNumber = `MR-${year}-${String(count + 1).padStart(6, "0")}`;

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

  return invoice;
}