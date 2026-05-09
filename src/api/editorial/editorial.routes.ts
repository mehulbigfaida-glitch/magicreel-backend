import { Router } from "express";

import { recommendEditorialWorld } from "./recommend";

import { generateCampaign } from "./generateCampaign";

const router = Router();

router.post(
  "/recommend",
  recommendEditorialWorld
);

router.post(
  "/generate-campaign",
  generateCampaign
);

export default router;