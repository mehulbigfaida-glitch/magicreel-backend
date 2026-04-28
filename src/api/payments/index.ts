import express from "express";
import { getPaymentHistory } from "./history";
import { authenticate } from "../../auth/jwt.middleware";

// 🔥 ADD THIS IMPORT
import { generateInvoiceForPayment } from "../../magicreel/services/invoice.service";

const router = express.Router();

// ✅ EXISTING ROUTE
router.get("/history", authenticate, getPaymentHistory);

// 🔥 TEST ROUTE (TEMPORARY)
router.get("/test-invoice", async (req, res) => {
  try {
    const invoice = await generateInvoiceForPayment({
      userId: "16595a8c-79f0-4adf-a802-cc19ed6ecbaf",

      // ⚠️ REPLACE THIS WITH REAL PAYMENT ID
      razorpayPaymentId: "pay_SiudyCcA5BgGry",
    });

    res.json({
      success: true,
      invoice,
    });
  } catch (err) {
    console.error("❌ TEST INVOICE ERROR:", err);
    res.status(500).json({ error: "Test invoice failed" });
  }
});

export default router;