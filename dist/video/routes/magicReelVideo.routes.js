"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const magicReelVideo_controller_1 = require("../controllers/magicReelVideo.controller");
const router = (0, express_1.Router)();
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
router.post("/magicreel", magicReelVideo_controller_1.generateMagicReelVideo);
exports.default = router;
