"use strict";
// src/video/director/controller/directorVideoEngine.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDirectorVideo = void 0;
const directorVideoQueue_1 = require("../../queues/directorVideoQueue");
const generateDirectorVideo = async (req, res) => {
    try {
        const { jobId, videoPath } = req.body;
        if (!jobId || !videoPath) {
            return res.status(400).json({
                success: false,
                message: "Missing jobId or videoPath",
            });
        }
        const job = await directorVideoQueue_1.directorVideoQueue.add("director-video-job", {
            jobId,
            videoPath,
        });
        return res.status(200).json({
            success: true,
            jobId: job.id,
            message: "Director Video generation started",
        });
    }
    catch (error) {
        console.error("❌ directorVideoEngine.controller error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to enqueue director video job",
        });
    }
};
exports.generateDirectorVideo = generateDirectorVideo;
