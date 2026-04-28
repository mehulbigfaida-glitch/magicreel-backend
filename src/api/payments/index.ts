import express from "express";
import { getPaymentHistory } from "./history";
import { authenticate } from "../../auth/jwt.middleware";

const router = express.Router();

// ✅ EXISTING ROUTE
router.get("/history", authenticate, getPaymentHistory);

export default router;