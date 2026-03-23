// src/video/director/controller/director.controller.ts

import { Request, Response } from "express";
import { processDirectorVoiceJob } from "../service/director.service";

export const handleDirectorVoiceJob = async (req: Request, res: Response) => {
  try {
    const { script, voiceId, speed, language } = req.body;

    if (!script) {
      return res.status(400).json({
        success: false,
        message: "script is required",
      });
    }

    const jobId = Date.now().toString();

    const result = await processDirectorVoiceJob(jobId, {
      script,
      voiceId,
      speed,
      language,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("[handleDirectorVoiceJob] Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
};
