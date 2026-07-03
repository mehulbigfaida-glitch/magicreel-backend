/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Director Service
 * ============================================================================
 *
 * Responsibility:
 * - Build the Campaign Director user prompt
 * - Invoke GPT
 * - Return a CreativeVision
 *
 * This service MUST NOT:
 * - Generate images
 * - Call FAL
 * - Upload to Cloudinary
 * - Build image generation prompts
 * ============================================================================
 */

import {
  CampaignInput,
  CreativeVision,
} from "../types/campaign.types";

import { gptClient } from "../ai/gptClient";

import {
  CAMPAIGN_DIRECTOR_SYSTEM_PROMPT,
} from "../prompts/campaignDirector.system";

import {
  buildCampaignDirectorUserPrompt,
} from "../prompts/campaignDirector.user";

export class CampaignDirectorService {
  public async createVision(
    input: CampaignInput
  ): Promise<CreativeVision> {
    const userPrompt =
      buildCampaignDirectorUserPrompt(input);

    const vision =
      await gptClient.generateJson<CreativeVision>(
        CAMPAIGN_DIRECTOR_SYSTEM_PROMPT,
        userPrompt
      );

    this.validateVision(vision);

    return vision;
  }

  /**
   * Ensures GPT returned a complete CreativeVision.
   */
  private validateVision(
    vision: CreativeVision
  ): void {
    const requiredFields: (keyof CreativeVision)[] = [
      "creativeDirection",
      "composition",
      "visualMood",
      "hierarchy",
      "typographyStyle",
      "logoPlacement",
    ];

    for (const field of requiredFields) {
      const value = vision[field];

      if (
        typeof value !== "string" ||
        value.trim().length === 0
      ) {
        throw new Error(
          `Campaign Director returned an invalid CreativeVision. Missing field: ${field}`
        );
      }
    }
  }
}