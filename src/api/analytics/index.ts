import { Router } from "express";
import { getCreditsAnalytics } from "./get-credits";
import { getProfitability } from "./get-profitability";

const router = Router();

// 🔥 GET /api/analytics/credits
router.get("/credits", getCreditsAnalytics);

// 🔥 GET /api/analytics/profitability
router.get("/profitability", getProfitability);

export default router;