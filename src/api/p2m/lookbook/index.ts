import { Router } from "express";
import { generateLookbookV2 } from "./generate-v2";
import { getLookbookStatus } from "./status";
import { billingGuard } from "../../../billing/billing.middleware";
import { authenticate } from "../../../auth/jwt.middleware";

const router = Router();

// Lookbook generation
router.post(
  "/generate-v2",
  authenticate,
  billingGuard("LOOKBOOK_ECOM"),
  generateLookbookV2
);

// Lookbook status polling
router.get(
  "/status",
  authenticate,
  getLookbookStatus
);

export default router;