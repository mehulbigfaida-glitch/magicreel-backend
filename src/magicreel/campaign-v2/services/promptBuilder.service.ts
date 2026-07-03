/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Prompt Builder Service
 * ============================================================================
 *
 * Responsibility:
 * Assemble the complete image generation request.
 *
 * This service DOES NOT:
 * - Make creative decisions
 * - Talk to GPT
 * - Call FAL
 * ============================================================================
 */

import {
  ImageGenerationRequest,
  PromptBuildInput,
} from "../types/campaign.types";

import {
  IMAGE_GENERATION_SYSTEM_PROMPT,
} from "../prompts/imageGeneration.system";

import {
  buildImageGenerationUserPrompt,
} from "../prompts/imageGeneration.user";

export class PromptBuilderService {
  public async buildPrompt(
    input: PromptBuildInput
  ): Promise<ImageGenerationRequest> {
    return {
      systemPrompt: IMAGE_GENERATION_SYSTEM_PROMPT,
      userPrompt: buildImageGenerationUserPrompt(input),
    };
  }
}