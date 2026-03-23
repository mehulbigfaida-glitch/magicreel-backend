// src/video/routes/videoRoutes.ts

import { Router } from "express";
import { videoGenerateController } from "../controllers/videoGenerateController";

const router = Router();

// NEW correct handler:
router.post("/generate", videoGenerateController.generate);

export default router;
