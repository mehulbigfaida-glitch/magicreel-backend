import { Router } from "express";
import { getPredictions } from "./getPredictions";
import { authenticate } from "../../auth/jwt.middleware";

const router = Router();

// 🔐 PROTECTED ROUTE
router.get("/", authenticate, getPredictions);

export default router;