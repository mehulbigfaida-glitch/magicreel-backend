// src/video/director/service/directorOrchestrator.ts

import axios from 'axios';
import path from 'path';
import fs from 'fs';

import {
  buildUnifiedTimeline,
  saveUnifiedTimeline,
} from '../utils/directorTimelineBuilder';

const BASE_AUDIO_DIR = path.join(process.cwd(), 'storage', 'director');

export interface DirectorOrchestratePayload {
  script: string;
  voiceId?: string;
  speed?: number;
  language?: string;
  metadata?: Record<string, any>;
}

export interface DirectorOrchestrateResult {
  jobId: string;
  audioTimelinePath?: string;
  audioFinalPath?: string;
  unifiedTimelinePath?: string;
}

export const orchestrateDirectorMode = async (
  payload: DirectorOrchestratePayload
): Promise<DirectorOrchestrateResult> => {
  const audioRes = await axios.post(
    'http://localhost:5001/api/video/director/voice',
    {
      script: payload.script,
      voiceId: payload.voiceId,
      speed: payload.speed,
      language: payload.language,
      metadata: payload.metadata,
    }
  );

  const jobId = audioRes.data?.data?.jobId;
  return { jobId };
};
