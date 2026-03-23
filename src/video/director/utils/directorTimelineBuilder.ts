// src/video/director/utils/directorTimelineBuilder.ts

import path from 'path';
import fs from 'fs';
import { buildCameraInstruction, CameraInstruction } from './cameraMovementEngine';

export interface DirectorSceneBlock {
  id: string;
  index: number;
  type: 'scene';
  preset: string;
  startMs: number;
  endMs: number;
  durationMs: number;
  camera: CameraInstruction;
}

export interface DirectorAudioBlock {
  type: 'audio';
  file: string;
  startMs: number;
  endMs: number;
}

export interface DirectorUnifiedTimeline {
  jobId: string;
  audio: DirectorAudioBlock;
  scenes: DirectorSceneBlock[];
  durationMs: number;
  createdAt: string;
}

const PRESET_SEQUENCE = [
  'studio_cyclorama',
  'street_neon_runway',
  'mirror_vogue',
  'studio_cyclorama',
  'vogue_moodboard',
  'street_neon_runway',
];

export const buildUnifiedTimeline = async (
  jobId: string,
  audioFinalPath: string,
  audioTotalDurationMs: number
): Promise<DirectorUnifiedTimeline> => {
  const totalScenes = Math.min(6, Math.max(3, Math.floor(audioTotalDurationMs / 3500)));
  const sceneDuration = Math.floor(audioTotalDurationMs / totalScenes);

  let scenes: DirectorSceneBlock[] = [];
  let cursor = 0;

  for (let i = 0; i < totalScenes; i++) {
    const preset = PRESET_SEQUENCE[i % PRESET_SEQUENCE.length];
    const startMs = cursor;
    const endMs = i === totalScenes - 1 ? audioTotalDurationMs : cursor + sceneDuration;

    const camera = buildCameraInstruction({
      preset,
      sceneIndex: i,
      totalScenes,
      durationMs: endMs - startMs,
    });

    scenes.push({
      id: `scene-${i + 1}`,
      index: i,
      type: 'scene',
      preset,
      startMs,
      endMs,
      durationMs: endMs - startMs,
      camera,
    });

    cursor = endMs;
  }

  const audioBlock: DirectorAudioBlock = {
    type: 'audio',
    file: audioFinalPath,
    startMs: 0,
    endMs: audioTotalDurationMs,
  };

  return {
    jobId,
    audio: audioBlock,
    scenes,
    durationMs: audioTotalDurationMs,
    createdAt: new Date().toISOString(),
  };
};

export const saveUnifiedTimeline = async (
  jobId: string,
  baseDir: string,
  timeline: DirectorUnifiedTimeline
): Promise<string> => {
  const folder = path.join(baseDir, jobId);
  await fs.promises.mkdir(folder, { recursive: true });

  const filePath = path.join(folder, 'unified_timeline.json');
  await fs.promises.writeFile(filePath, JSON.stringify(timeline, null, 2), 'utf8');

  return filePath;
};
