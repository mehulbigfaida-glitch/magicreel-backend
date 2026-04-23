import { Router } from "express";
import { getCreditsAnalytics } from "./get-credits";
import { getProfitability } from "./get-profitability";
import { authenticate } from "../../auth/jwt.middleware";

const router = Router();

// 🔒 PROTECTED ROUTES
router.get("/credits", authenticate, getCreditsAnalytics);
router.get("/profitability", authenticate, getProfitability);

export default router;