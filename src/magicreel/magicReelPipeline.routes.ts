import { Router } from "express";
import {
  generateMagicReelController,
  magicReelStatusController,
} from "./magicReelPipeline.controller";

import { generateLookbookController } from "./controllers/lookbookGenerate.controller";

const router = Router();

// 🔹 LOOKBOOK / P2M (GARMENT → MODEL → FASHN)
router.post("/lookbook/generate", generateLookbookController);

// 🔹 HERO / VIDEO PIPELINE (UNCHANGED)
router.post("/generate", generateMagicReelController);
router.get("/status/:jobId", magicReelStatusController);

export default router;
