// src/video/director/controller/directorOrchestrator.controller.ts

import { Request, Response } from 'express';
import { orchestrateDirectorMode } from '../service/directorOrchestrator';

export const orchestrateDirector = async (req: Request, res: Response) => {
  const { script, voiceId, speed, language, metadata } = req.body || {};

  if (!script) {
    return res.status(400).json({
      success: false,
      message: "Missing script",
    });
  }

  const result = await orchestrateDirectorMode({
    script,
    voiceId,
    speed,
    language,
    metadata,
  });

  return res.status(200).json({
    success: true,
    message: "Director Mode Orchestration Started",
    data: result,
  });
};
