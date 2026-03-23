// src/video/director/controller/directorUnifiedTimeline.controller.ts

import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import {
  buildUnifiedTimeline,
  saveUnifiedTimeline,
} from '../utils/directorTimelineBuilder';

const BASE_DIR = path.join(process.cwd(), 'storage', 'director');

export const buildUnifiedDirectorTimeline = async (req: Request, res: Response) => {
  const { jobId, audioPath, durationMs } = req.body || {};

  if (!jobId || !audioPath || !durationMs) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const timeline = await buildUnifiedTimeline(
    jobId,
    audioPath,
    durationMs
  );

  const unifiedPath = await saveUnifiedTimeline(jobId, BASE_DIR, timeline);

  return res.status(200).json({
    success: true,
    message: "Unified timeline created",
    data: {
      unifiedTimelinePath: unifiedPath,
    },
  });
};
