import { getLookbookById } from "./get-lookbook";
import { Router } from "express";
import { generateLookbookV2 } from "./generate-v2";
import { getLookbookStatus } from "./status";
import { exportLookbook } from "./export";
import { billingGuard } from "../../../billing/billing.middleware";
import { authenticate } from "../../../auth/jwt.middleware";

const router = Router();

/* -------------------------------
   LOOKBOOK GENERATION
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
   EXPORT (SAFE WRAP)
-------------------------------- */

router.post(
  "/export",
  authenticate,
  (req, res) => exportLookbook(req, res) // ✅ prevents undefined crash
);

/* -------------------------------
   PUBLIC FETCH (FOR SHARE)
-------------------------------- */

router.get("/lookbook/:id", getLookbookById);

export default router;