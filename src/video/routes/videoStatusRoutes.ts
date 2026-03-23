// src/video/routes/videoStatusRoutes.ts

import { Router } from "express";
import { videoStatusController } from "../controllers/videoStatusController";

const router = Router();

// GET /api/video-status/:id
router.get("/:id", videoStatusController);

export default router;
