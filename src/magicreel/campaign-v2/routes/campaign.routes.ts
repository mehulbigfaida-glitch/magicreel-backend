/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Routes
 * ============================================================================
 */

import { Router } from "express";

import { campaignController } from "../controllers/campaign.controller";

const router = Router();

/**
 * POST /campaign/generate
 *
 * Body:
 * {
 *   heroImageUrl,
 *   logoUrl,
 *   headline,
 *   subheadline?,
 *   cta?
 * }
 */
router.post(
  "/generate",
  campaignController.generateCampaign
);
/**
 * GET /campaign/:id
 */
router.get(
  "/:id",
  campaignController.getCampaign
);
export default router;