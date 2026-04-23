import { Router } from "express";
import { getCreditsAnalytics } from "./get-credits";

const router = Router();

// 🔥 GET /api/analytics/credits
router.get("/credits", getCreditsAnalytics);

export default router;