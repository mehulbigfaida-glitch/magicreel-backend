import { Router } from "express";

import {
  billingGuard,
} from "../../billing/billing.middleware";

import { recommendEditorialWorld } from "./recommend";

import { generateCampaign } from "./generateCampaign";

const router = Router();

router.post(
  "/recommend",
  recommendEditorialWorld
);

router.post(
  "/generate-campaign",
  billingGuard("EDITORIAL"),
  generateCampaign
);

export default router;