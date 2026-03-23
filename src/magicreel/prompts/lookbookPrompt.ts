// src/magicreel/prompts/lookbookPrompt.ts

import { POSE_REGISTRY_V1, PoseDefinition } from "./poseRegistryV1";

export interface LookbookPromptInput {
  basePrompt: string;
  poseId: string;
}

/**
 * Builds a single-line prompt for a specific lookbook pose.
 * Only used for FASHN-generated poses.
 */
export function buildLookbookPrompt(input: LookbookPromptInput): string {
  const { basePrompt, poseId } = input;

  const pose: PoseDefinition | undefined = POSE_REGISTRY_V1.find(
    (p) => p.id === poseId
  );

  if (!pose) {
    throw new Error(`Invalid poseId: ${poseId}`);
  }

  if (pose.source !== "FASHN") {
    throw new Error(
      `Pose ${poseId} is not a FASHN-generated pose and should not use prompt generation`
    );
  }

  if (!pose.promptModifier) {
    throw new Error(`Pose ${poseId} missing promptModifier`);
  }

  // Append pose modifier
  const promptWithPose = `${basePrompt}, ${pose.promptModifier}`;

  // FASHN requires single-line prompts
  return promptWithPose.replace(/\s+/g, " ").trim();
}
