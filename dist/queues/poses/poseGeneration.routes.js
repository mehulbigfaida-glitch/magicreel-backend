"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const poseGeneration_controller_1 = require("./poseGeneration.controller");
const router = (0, express_1.Router)();
/**
 * POST /api/poses/generate
 * Body:
 * {
 *   "heroImagePath": "D:/path/to/hero_image.png"
 * }
 */
router.post("/generate", poseGeneration_controller_1.generatePoses);
exports.default = router;
