// src/video/director/operators/krea.operator.ts

import fs from 'fs';
import path from 'path';
import {
  DirectorSceneInput,
  DirectorSceneOutput,
  DirectorSceneOperator,
} from './operator.interface';
import { buildDirectorPrompt } from '../utils/promptEngine.utils';

export const kreaOperator: DirectorSceneOperator = {
  id: 'krea',
  label: 'KREA AI Operator',

  async generate(input: DirectorSceneInput): Promise<DirectorSceneOutput> {
    const jobFolder = path.join(process.cwd(), 'storage', 'director_video', input.jobId);
    await fs.promises.mkdir(jobFolder, { recursive: true });

    const sceneMeta = input.metadata || {};
    const camera = (sceneMeta as any).camera || null;

    const cameraPromptPart = camera?.promptSnippet || 'smooth cinematic camera movement';

    const prompt = buildDirectorPrompt({
      preset: input.preset,
      durationMs: input.durationMs,
      cameraPrompt: cameraPromptPart,
      tone: 'runway',
      styleTags: ['neon accents', 'vogue editorial', 'soft bloom highlight'],
      extraDetails: 'model focus, garment details always clear, no motion blur on subject',
    });

    const filePath = path.join(jobFolder, `${input.sceneId}_krea.mp4`);

    await fs.promises.writeFile(filePath, Buffer.alloc(10));

    await fs.promises.writeFile(
      path.join(jobFolder, `${input.sceneId}_krea_prompt.txt`),
      prompt,
      'utf8'
    );

    return {
      sceneId: input.sceneId,
      videoPath: filePath,
      durationMs: input.durationMs,
    };
  },
};
