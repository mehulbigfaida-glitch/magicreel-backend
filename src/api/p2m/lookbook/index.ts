import { Router } from "express";
import { generateLookbookV2 } from "./generate-v2";
import { getLookbookStatus } from "./status";
import { exportLookbook } from "./export";
import { billingGuard } from "../../../billing/billing.middleware";
import { authenticate } from "../../../auth/jwt.middleware";
import { getLookbookById } from "./get-lookbook";

const router = Router();

/* -------------------------------
   🌍 PUBLIC FETCH (FOR SHARE)
-------------------------------- */
// 🔥 IMPORTANT: NO AUTH HERE
router.get("/:id", getLookbookById);

/* -------------------------------
   LOOKBOOK GENERATION (PROTECTED)
-------------------------------- */
router.post(
  "/generate-v2",
  authenticate,
  billingGuard("LOOKBOOK_ECOM"),
  generateLookbookV2
);

/* -------------------------------
   STATUS (PROTECTED)
-------------------------------- */
router.get(
  "/status",
  authenticate,
  getLookbookStatus
);

/* -------------------------------
   EXPORT (PROTECTED)
-------------------------------- */
router.post(
  "/export",
  authenticate,
  (req, res) => exportLookbook(req, res)
);

export default router;