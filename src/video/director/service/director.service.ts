// src/video/director/service/director.service.ts

import path from 'path';
import fs from 'fs';

import {
  buildTimelineForScript,
  generateRealAudioForTimeline,
  saveTimelineToDisk,
  DirectorAudioConfig,
  DirectorVoiceoverTimeline,
} from '../utils/audioEngine.utils';

const BASE_DIR = path.join(process.cwd(), 'storage', 'director');

const ensureDir = async (dir: string) => {
  await fs.promises.mkdir(dir, { recursive: true });
};

export interface DirectorVoiceJobPayload {
  script: string;
  voiceId?: string;
  speed?: number;
  language?: string;
  metadata?: Record<string, any>;
}

export interface DirectorVoiceJobResult {
  audioTimelinePath: string;
  audioDir: string;
  finalAudioPath: string;
  audioDurationMs: number;
  segments: {
    id: string;
    text: string;
    startMs: number;
    endMs: number;
    approximateDurationMs: number;
    audioPath: string | null;
  }[];
}

export const processDirectorVoiceJob = async (
  jobId: string,
  payload: DirectorVoiceJobPayload
): Promise<DirectorVoiceJobResult> => {
  await ensureDir(BASE_DIR);

  const config: DirectorAudioConfig = {
    voiceId: payload.voiceId || 'director_indian_female',
    speed: payload.speed || 1.0,
    language: payload.language || 'en',
    maxSegmentChars: 380,
  };

  let timeline: DirectorVoiceoverTimeline = buildTimelineForScript(
    jobId,
    payload.script,
    config
  );

  timeline = await generateRealAudioForTimeline(BASE_DIR, timeline);

  const audioTimelinePath = await saveTimelineToDisk(BASE_DIR, timeline);
  const jobFolder = path.dirname(audioTimelinePath);

  const finalAudioPath = path.join(jobFolder, 'final.mp3');

  return {
    audioTimelinePath,
    audioDir: jobFolder,
    finalAudioPath,
    audioDurationMs: timeline.totalDurationMs,
    segments: timeline.segments.map((seg) => ({
      id: seg.id,
      text: seg.text,
      startMs: seg.startMs,
      endMs: seg.endMs,
      approximateDurationMs: seg.approximateDurationMs,
      audioPath: seg.audioPath,
    })),
  };
};
