import { Router } from "express";
import { getAdminAnalytics } from "./get-admin-analytics";
import { authenticate } from "../../auth/jwt.middleware";

const router = Router();

// 🔒 protected
router.get("/analytics", authenticate, getAdminAnalytics);

export default router;