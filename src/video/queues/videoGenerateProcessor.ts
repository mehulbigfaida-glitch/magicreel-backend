// src/video/queues/videoGenerateProcessor.ts

import { Job } from "bullmq";
import { generateBasicMotion } from "../utils/basicMotionEngine";

interface VideoGenerateJob {
  imagePath: string;
  outputPath: string;
  motion: "zoomIn" | "zoomOut" | "panLeft";
  durationSeconds: number;
  fps: number;
  width?: number;
  height?: number;
}

// 👇 VERY IMPORTANT: Name must match videoWorkerInit.ts
export const processVideoJob = async (job: Job<VideoGenerateJob>) => {
  console.log("[processVideoJob] Received job:", job.data);

  try {
    const {
      imagePath,
      outputPath,
      motion,
      durationSeconds,
      fps,
      width,
      height,
    } = job.data;

    job.updateProgress(10);

    await generateBasicMotion({
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
  } catch (err) {
    console.error("[processVideoJob] ERROR:", err);
    throw new Error("Motion video generation failed");
  }
};
