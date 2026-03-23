// src/video/director/controller/directorScenesEngine.controller.ts

import { Request, Response } from 'express';
import { directorSceneQueue } from '../../queues/directorSceneQueue';

export const generateDirectorScenes = async (req: Request, res: Response) => {
  const { jobId, timelinePath, audioDurationMs } = req.body || {};

  if (!jobId || !timelinePath || !audioDurationMs) {
    return res.status(400).json({
      success: false,
      message: 'jobId, timelinePath and audioDurationMs are required',
    });
  }

  const job = await directorSceneQueue.add(
    'director-generate-scenes',
    { jobId, timelinePath, audioDurationMs },
    { attempts: 3, removeOnComplete: false, removeOnFail: false }
  );

  return res.status(202).json({
    success: true,
    message: 'Scene generation started',
    data: { jobId: job.id },
  });
};

export const getDirectorScenesStatus = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  const job = await directorSceneQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Scene job not found',
    });
  }

  const state = await job.getState();
  const progress = job.progress;
  const result = job.returnvalue;

  return res.status(200).json({
    success: true,
    message: 'Scene job status',
    data: { status: state, progress, result },
  });
};
