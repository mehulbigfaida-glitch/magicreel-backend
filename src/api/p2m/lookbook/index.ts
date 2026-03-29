import { Router } from "express";
import { generateLookbookV2 } from "./generate-v2";
import { getLookbookStatus } from "./status";
import { exportLookbook } from "./export";
import { billingGuard } from "../../../billing/billing.middleware";
import { authenticate } from "../../../auth/jwt.middleware";

const router = Router();

/* -------------------------------
   LOOKBOOK GENERATION (WITH BILLING)
-------------------------------- */

router.post(
  "/generate-v2",
  authenticate,
  billingGuard("LOOKBOOK_ECOM"),
  generateLookbookV2
);

/* -------------------------------
   STATUS
-------------------------------- */

router.get(
  "/status",
  authenticate,
  getLookbookStatus
);

/* -------------------------------
   EXPORT
-------------------------------- */

router.post(
  "/export",
  authenticate,
  exportLookbook
);

export default router;