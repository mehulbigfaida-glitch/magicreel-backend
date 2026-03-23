import { Router } from "express";
import { generateMagicReelVideo } from "../controllers/magicReelVideo.controller";

const router = Router();

/**
 * POST /api/video/magicreel
 * Body:
 * {
 *   "clips": [
 *     "D:/magicreel/tryon data/look_1.mp4",
 *     "D:/magicreel/tryon data/look_2.mp4",
 *     "D:/magicreel/tryon data/look_3.mp4"
 *   ]
 * }
 */
router.post("/magicreel", generateMagicReelVideo);

export default router;
