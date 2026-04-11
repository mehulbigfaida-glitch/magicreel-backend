"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const magicReelPipeline_controller_1 = require("./magicReelPipeline.controller");
const lookbookGenerate_controller_1 = require("./controllers/lookbookGenerate.controller");
const router = (0, express_1.Router)();
// 🔹 LOOKBOOK / P2M (GARMENT → MODEL → FASHN)
router.post("/lookbook/generate", lookbookGenerate_controller_1.generateLookbookController);
// 🔹 HERO / VIDEO PIPELINE (UNCHANGED)
router.post("/generate", magicReelPipeline_controller_1.generateMagicReelController);
router.get("/status/:jobId", magicReelPipeline_controller_1.magicReelStatusController);
exports.default = router;
