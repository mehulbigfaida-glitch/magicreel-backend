// src/tryon/routes/tryonStatusRoutes.ts
import { Router } from "express";
import { getTryOnStatus } from "../controllers/tryonStatusController";

const router = Router();

// GET /api/tryon-status/:id
router.get("/:id", getTryOnStatus);

export default router;
