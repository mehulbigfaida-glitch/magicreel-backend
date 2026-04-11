"use strict";
// src/video/services/videoStatusService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoJob = getVideoJob;
async function getVideoJob(jobId) {
    return {
        id: jobId,
        status: "completed",
        progress: 100,
        videoUrl: `https://dummy.video/${jobId}.mp4`,
    };
}
