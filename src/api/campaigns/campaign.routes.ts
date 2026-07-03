console.log("🔥 CAMPAIGN ROUTES FILE LOADED");

import { Router } from "express";
import { authenticate } from "../../auth/jwt.middleware";

import { generateCampaign } from "./generate-campaign";
import { getCampaign } from "./get-campaign";

const router = Router();

/* ---------------------------------- */
/* HEALTH CHECK */
/* ---------------------------------- */

router.get(
  "/generate",
  (_req, res) => {
    res.json({
      success: true,
      route: "campaign alive",
    });
  }
);

/* ---------------------------------- */
/* GET CAMPAIGN */
/* ---------------------------------- */

router.get(
  "/:id",
  authenticate,
  getCampaign
);

/* ---------------------------------- */
/* GENERATE CAMPAIGN */
/* ---------------------------------- */

router.post(
  "/generate",
  authenticate,
  generateCampaign
);

export default router;