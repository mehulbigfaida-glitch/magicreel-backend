// src/video/controllers/videoGenerateController.ts

import { Request, Response } from "express";
import { videoGenerateService } from "../services/videoGenerateService";

export const videoGenerateController = {
  async generate(req: Request, res: Response) {
    try {
      const {
        imagePath,
        motion = "zoomIn",
        durationSeconds = 5,
        fps = 24,
        width,
        height,
      } = req.body;

      if (!imagePath) {
        return res.status(400).json({
          success: false,
          message: "imagePath is required",
        });
      }

      const result =
        await videoGenerateService.generateBasicMotionVideo({
          imagePath,
          motion,
          durationSeconds,
          fps,
          width,
          height,
        });

      return res.json({
        success: true,
        message: "Motion video generation started",
        ...result,
      });
    } catch (err: any) {
      console.error("[videoGenerateController] ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
  },
};
