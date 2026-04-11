"use strict";
// src/video/controllers/videoStatusController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoStatusController = videoStatusController;
const videoStatusService_1 = require("../services/videoStatusService");
async function videoStatusController(req, res) {
    try {
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Missing job ID",
            });
        }
        const job = await (0, videoStatusService_1.getVideoJob)(jobId);
        return res.json({
            success: true,
            data: job,
        });
    }
    catch (err) {
        console.error("Video status error:", err);
        return res.status(500).json({
            success: false,
            message: "Video status fetch failed",
            error: err?.message,
        });
    }
}
