import { Router } from "express";
import { generateHeroV3 } from "./generate-v3";
import { pollHeroGeneration } from "./poll";
import { authenticate } from "../../../auth/jwt.middleware";
import { subscriptionMiddleware } from "../../../subscription/subscription.middleware";
import { billingGuard } from "../../../billing/billing.middleware";

const router = Router();

/* ================= HERO GENERATION ================= */

router.post(
  "/generate-v2",
  authenticate,
  subscriptionMiddleware,
  billingGuard("HERO"),
  generateHeroV3
);

/* ================= HERO POLLING ================= */

router.get(
  "/poll/:runId",
  authenticate,
  pollHeroGeneration
);

export default router;