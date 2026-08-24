import express from "express";
import { getPaymentHistory } from "./history";
import { authenticate } from "../../auth/jwt.middleware";

// 👉 ADD THIS IMPORT
import { createCreditTopupOrder } from "./create-credit-topup";
import { verifyCreditTopup } from "./verify-credit-topup";
import { createPublishingOrder } from "./create-publishing-order";
import { verifyPublishing } from "./verify-publishing";

const router = express.Router();

// ✅ EXISTING ROUTE
router.get("/history", authenticate, getPaymentHistory);

router.post(
  "/create-credit-topup",
  authenticate,
  createCreditTopupOrder
);

router.post(
  "/verify-credit-topup",
  authenticate,
  verifyCreditTopup
);

router.post(
  "/create-publishing-order",
  authenticate,
  createPublishingOrder
);

router.post(
  "/verify-publishing",
  authenticate,
  verifyPublishing
);

export default router;