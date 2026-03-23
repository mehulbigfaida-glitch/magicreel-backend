import { Router } from "express";
import { generatePoses } from "./poseGeneration.controller";

const router = Router();

/**
 * POST /api/poses/generate
 * Body:
 * {
 *   "heroImagePath": "D:/path/to/hero_image.png"
 * }
 */
router.post("/generate", generatePoses);

export default router;
