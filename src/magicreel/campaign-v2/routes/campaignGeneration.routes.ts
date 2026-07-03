/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Generation Routes
 * ============================================================================
 */

import { Router } from "express";

import campaignGenerationController
  from "../controllers/campaignGeneration.controller";

import { authenticate }
  from "../../../auth/jwt.middleware";

import {
  billingGuard,
} from "../../../billing/billing.middleware";

const router = Router();

router.post(
  "/generate",
  authenticate,
  billingGuard("CAMPAIGN_ENGINE"),
  campaignGenerationController.generateCampaign
);

router.get(
  "/:id",
  authenticate,
  campaignGenerationController.getCampaign
);

export default router;