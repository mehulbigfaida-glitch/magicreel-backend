import { Router } from "express";
import { getAdminAnalytics } from "./get-admin-analytics";
import { authenticate } from "../../auth/jwt.middleware";
import {
  getTestingCreditRequests,
  approveTestingCreditRequest,
  rejectTestingCreditRequest,
} from "../testing-credits/testingCredit.controller";

const router = Router();

// 🔒 protected
router.get(
  "/analytics",
  authenticate,
  getAdminAnalytics
);

// ======================================================
// TESTING CREDIT REQUESTS
// ======================================================

router.get(
  "/testing-credits",
  authenticate,
  getTestingCreditRequests
);

router.post(
  "/testing-credits/:id/approve",
  authenticate,
  approveTestingCreditRequest
);

router.post(
  "/testing-credits/:id/reject",
  authenticate,
  rejectTestingCreditRequest
);

export default router;