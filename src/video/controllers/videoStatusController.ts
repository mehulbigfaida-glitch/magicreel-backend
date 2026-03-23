// src/video/controllers/videoStatusController.ts

import { Request, Response } from "express";
import { getVideoJob } from "../services/videoStatusService";

export async function videoStatusController(req: Request, res: Response) {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Missing job ID",
      });
    }

    const job = await getVideoJob(jobId);

    return res.json({
      success: true,
      data: job,
    });

  } catch (err: any) {
    console.error("Video status error:", err);
    return res.status(500).json({
      success: false,
      message: "Video status fetch failed",
      error: err?.message,
    });
  }
}
