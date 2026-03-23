// src/magicreel/engines/lookbookJob.engine.ts
// 🔒 Lookbook Job Creator — v1.0 (NO EXECUTION)

import {
  LookbookJob,
  LOOKBOOK_PRESETS,
  LookbookPresetId,
  ModelId,
} from "../schema/lookbook.schema";

import { createLookbookRenderJob } from "./lookbookImage.engine";

/**
 * Input required to create a LookbookJob
 */
interface CreateLookbookJobInput {
  lookbookId: string;
  modelId: ModelId;
  garmentId: string;
  presetId: LookbookPresetId;
}

/**
 * Creates a LookbookJob with multiple RenderJobs
 * - Expands preset → poses
 * - One RenderJob per pose
 * - NO execution
 */
export const createLookbookJob = async (
  input: CreateLookbookJobInput
): Promise<LookbookJob> => {
  const { lookbookId, modelId, garmentId, presetId } = input;

  const poses = LOOKBOOK_PRESETS[presetId];

  if (!poses || poses.length === 0) {
    throw new Error(`Invalid lookbook preset: ${presetId}`);
  }

  const renderJobs = [];

  for (const pose of poses) {
    const job = await createLookbookRenderJob({
      lookbookId,
      modelId,
      garmentId,
      pose,
    });

    renderJobs.push(job);
  }

  const lookbookJob: LookbookJob = {
    lookbookId,
    modelId,
    garmentId,
    presetId,

    poses,

    status: "created",
    renderJobs,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return lookbookJob;
};
