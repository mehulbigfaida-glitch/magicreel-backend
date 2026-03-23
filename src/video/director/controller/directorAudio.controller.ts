// src/video/director/controller/directorAudio.controller.ts

import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { directorAudioQueue } from '../../queues/directorAudioQueue';

const BASE_DIR = path.join(process.cwd(), 'storage', 'director');

export const createVoiceJob = async (req: Request, res: Response) => {
  const { script, voiceId, speed, language, metadata } = req.body || {};

  if (!script || typeof script !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid script',
    });
  }

  const job = await directorAudioQueue.add(
    'director-generate-audio',
    { script, voiceId, speed, language, metadata },
    { attempts: 3, removeOnComplete: false, removeOnFail: false }
  );

  return res.status(202).json({
    success: true,
    message: 'Voice generation started',
    data: { jobId: job.id },
  });
};

export const getVoiceJobStatus = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  const job = await directorAudioQueue.getJob(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  const state = await job.getState();
  const progress = job.progress || 0;
  const result = job.returnvalue || null;

  return res.status(200).json({
    success: true,
    message: 'Job status',
    data: { status: state, progress, result },
  });
};

export const getFinalVoiceAssets = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  const safe = jobId.replace(/[^a-zA-Z0-9_-]/g, '');
  const jobFolder = path.join(BASE_DIR, safe);

  const finalPath = path.join(jobFolder, 'final.mp3');
  const timelinePath = path.join(jobFolder, 'timeline.json');

  const existsFinal = fs.existsSync(finalPath);
  const existsJson = fs.existsSync(timelinePath);

  if (!existsFinal || !existsJson) {
    return res.status(404).json({
      success: false,
      message: 'Final audio not ready',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Final voice assets',
    data: {
      finalAudio: finalPath,
      timeline: timelinePath,
    },
  });
};

export const downloadFinalAudio = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  const safe = jobId.replace(/[^a-zA-Z0-9_-]/g, '');
  const jobFolder = path.join(BASE_DIR, safe);
  const finalPath = path.join(jobFolder, 'final.mp3');

  if (!fs.existsSync(finalPath)) {
    return res.status(404).send('Final audio not found');
  }

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', `attachment; filename="${jobId}.mp3"`);
  fs.createReadStream(finalPath).pipe(res);
};
