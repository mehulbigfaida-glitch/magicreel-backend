// src/video/services/videoGenerateService.ts

import path from "path";
import { videoQueue } from "../queues/videoQueue";

interface GenerateVideoParams {
  imagePath: string;
  motion: "zoomIn" | "zoomOut" | "panLeft";
  durationSeconds: number;
  fps: number;
  width?: number;
  height?: number;
}

export class VideoGenerateService {
  async generateBasicMotionVideo(params: GenerateVideoParams) {
    const {
      imagePath,
      motion,
      durationSeconds,
      fps,
      width,
      height,
    } = params;

    // OUTPUT PATH (inside uploads/videos folder)
    const outputPath = path.resolve(
      "uploads/videos",
      `motion_${Date.now()}.mp4`
    );

    // Add job to queue
    const job = await videoQueue.add("generateMotion", {
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

export const videoGenerateService = new VideoGenerateService();
