import { Router } from "express";
import { generateHeroV2 } from "./generate-v2";
import { pollHeroGeneration } from "./poll";
import { authenticate } from "../../../auth/jwt.middleware";
import { billingGuard } from "../../../billing/billing.middleware";

const router = Router();

/* ================= HERO GENERATION ================= */

router.post(
  "/generate-v2",
  authenticate,
  billingGuard("HERO"),
  generateHeroV2
);

/* ================= HERO POLLING ================= */

router.get(
  "/poll/:runId",
  authenticate,
  pollHeroGeneration
);

export default router;