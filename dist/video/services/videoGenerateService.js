"use strict";
// src/video/services/videoGenerateService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoGenerateService = exports.VideoGenerateService = void 0;
const path_1 = __importDefault(require("path"));
const videoQueue_1 = require("../queues/videoQueue");
class VideoGenerateService {
    async generateBasicMotionVideo(params) {
        const { imagePath, motion, durationSeconds, fps, width, height, } = params;
        // OUTPUT PATH (inside uploads/videos folder)
        const outputPath = path_1.default.resolve("uploads/videos", `motion_${Date.now()}.mp4`);
        // Add job to queue
        const job = await videoQueue_1.videoQueue.add("generateMotion", {
            imagePath,
            outputPath,
            motion,
            durationSeconds,
            fps,
            width,
            height,
        });
        return {
            jobId: job.id,
            outputPath,
        };
    }
}
exports.VideoGenerateService = VideoGenerateService;
exports.videoGenerateService = new VideoGenerateService();
