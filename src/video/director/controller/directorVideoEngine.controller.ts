// src/video/director/controller/directorVideoEngine.controller.ts

import { Request, Response } from "express";
import { directorVideoQueue } from "../../queues/directorVideoQueue";

export const generateDirectorVideo = async (req: Request, res: Response) => {
  try {
    const { jobId, videoPath } = req.body;

    if (!jobId || !videoPath) {
      return res.status(400).json({
        success: false,
        message: "Missing jobId or videoPath",
      });
    }

    const job = await directorVideoQueue.add("director-video-job", {
      jobId,
      videoPath,
    });

    return res.status(200).json({
      success: true,
      jobId: job.id,
      message: "Director Video generation started",
    });
  } catch (error) {
    console.error("❌ directorVideoEngine.controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to enqueue director video job",
    });
  }
};
