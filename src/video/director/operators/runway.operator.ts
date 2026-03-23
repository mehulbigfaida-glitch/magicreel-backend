// src/video/director/operators/runway.operator.ts

import fs from 'fs';
import path from 'path';
import {
  DirectorSceneInput,
  DirectorSceneOutput,
  DirectorSceneOperator,
} from './operator.interface';
import { buildDirectorPrompt } from '../utils/promptEngine.utils';

export const runwayOperator: DirectorSceneOperator = {
  id: 'runway',
  label: 'RunwayML Operator',

  async generate(input: DirectorSceneInput): Promise<DirectorSceneOutput> {
    const jobFolder = path.join(process.cwd(), 'storage', 'director_video', input.jobId);
    await fs.promises.mkdir(jobFolder, { recursive: true });

    const sceneMeta = input.metadata || {};
    const camera = (sceneMeta as any).camera || null;

    const cameraPromptPart = camera?.promptSnippet || 'smooth lateral motion';

    const prompt = buildDirectorPrompt({
      preset: input.preset,
      durationMs: input.durationMs,
      cameraPrompt: cameraPromptPart,
      tone: 'editorial',
      styleTags: ['runwayml style', 'soft film grain', 'cinematic contrast'],
      extraDetails: 'no text on screen, no logos, focus on full outfit silhouette',
    });

    const filePath = path.join(jobFolder, `${input.sceneId}_runway.mp4`);

    await fs.promises.writeFile(filePath, Buffer.alloc(10));

    await fs.promises.writeFile(
      path.join(jobFolder, `${input.sceneId}_runway_prompt.txt`),
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
