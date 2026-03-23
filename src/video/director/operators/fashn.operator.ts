// src/video/director/operators/fashn.operator.ts

import fs from 'fs';
import path from 'path';
import {
  DirectorSceneInput,
  DirectorSceneOutput,
  DirectorSceneOperator,
} from './operator.interface';
import { buildDirectorPrompt } from '../utils/promptEngine.utils';

export const fashnOperator: DirectorSceneOperator = {
  id: 'fashn',
  label: 'Fashn AI Operator',

  async generate(input: DirectorSceneInput): Promise<DirectorSceneOutput> {
    const jobFolder = path.join(process.cwd(), 'storage', 'director_video', input.jobId);
    await fs.promises.mkdir(jobFolder, { recursive: true });

    const sceneMeta = input.metadata || {};
    const camera = (sceneMeta as any).camera || null;

    const cameraPromptPart = camera?.promptSnippet || 'gentle motion around model';

    const prompt = buildDirectorPrompt({
      preset: input.preset,
      durationMs: input.durationMs,
      cameraPrompt: cameraPromptPart,
      tone: 'commercial',
      styleTags: ['clean studio light', 'true-to-color garments', 'ecommerce ready'],
      extraDetails: 'full body and mid-shot alternation, clear view of fabric texture',
    });

    const filePath = path.join(jobFolder, `${input.sceneId}_fashn.mp4`);

    await fs.promises.writeFile(filePath, Buffer.alloc(10));

    await fs.promises.writeFile(
      path.join(jobFolder, `${input.sceneId}_fashn_prompt.txt`),
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
