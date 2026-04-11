"use strict";
// src/video/queues/videoGenerateProcessor.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideoJob = void 0;
const basicMotionEngine_1 = require("../utils/basicMotionEngine");
// 👇 VERY IMPORTANT: Name must match videoWorkerInit.ts
const processVideoJob = async (job) => {
    console.log("[processVideoJob] Received job:", job.data);
    try {
        const { imagePath, outputPath, motion, durationSeconds, fps, width, height, } = job.data;
        job.updateProgress(10);
        await (0, basicMotionEngine_1.generateBasicMotion)({
            imagePath,
            outputPath,
            motion,
            durationSeconds,
            fps,
            width,
            height,
        });
        job.updateProgress(100);
        console.log("[processVideoJob] Video generated:", outputPath);
        return {
            success: true,
            outputPath,
        };
    }
    catch (err) {
        console.error("[processVideoJob] ERROR:", err);
        throw new Error("Motion video generation failed");
    }
};
exports.processVideoJob = processVideoJob;
