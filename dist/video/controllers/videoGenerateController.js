"use strict";
// src/video/controllers/videoGenerateController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoGenerateController = void 0;
const videoGenerateService_1 = require("../services/videoGenerateService");
exports.videoGenerateController = {
    async generate(req, res) {
        try {
            const { imagePath, motion = "zoomIn", durationSeconds = 5, fps = 24, width, height, } = req.body;
            if (!imagePath) {
                return res.status(400).json({
                    success: false,
                    message: "imagePath is required",
                });
            }
            const result = await videoGenerateService_1.videoGenerateService.generateBasicMotionVideo({
                imagePath,
                motion,
                durationSeconds,
                fps,
                width,
                height,
            });
            return res.json({
                success: true,
                message: "Motion video generation started",
                ...result,
            });
        }
        catch (err) {
            console.error("[videoGenerateController] ERROR:", err);
            return res.status(500).json({
                success: false,
                message: err.message || "Server error",
            });
        }
    },
};
