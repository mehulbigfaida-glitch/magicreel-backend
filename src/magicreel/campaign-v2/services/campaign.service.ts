/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Service
 * ============================================================================
 */
console.log("🔥 CAMPAIGN V2 SERVICE HIT");
import {
  CampaignGenerationResult,
  CampaignInput,
} from "../types/campaign.types";

import { CampaignDirectorService } from "./campaignDirector.service";
import { PromptBuilderService } from "./promptBuilder.service";
import { FalImageService } from "./falImage.service";
import { campaignRepository } from "../repositories/campaign.repository";

export class CampaignService {
  private readonly campaignDirector =
    new CampaignDirectorService();

  private readonly promptBuilder =
    new PromptBuilderService();

  private readonly falImage =
    new FalImageService();

  public async generateCampaign(
    input: CampaignInput
  ): Promise<CampaignGenerationResult> {
    /**
     * STEP 1
     * Generate Creative Vision
     */
    const vision =
      await this.campaignDirector.createVision(input);

    /**
     * STEP 2
     * Build Image Generation Request
     */
    const imageRequest =
      await this.promptBuilder.buildPrompt({
        ...input,
        vision,
      });

console.log("STEP 2 OUTPUT");
console.log(imageRequest);

    /**
 * STEP 3
 * Generate Campaign Image
 */

console.log("===== CALLING FAL =====");
console.log(
  JSON.stringify(
    {
      imageRequest,
      referenceImages: [
        input.heroImageUrl,
        input.logoUrl,
        ...input.supportingHeroUrls,
      ],
    },
    null,
    2
  )
);
console.log("=======================");
    const imageUrl =
  await this.falImage.generateCampaignImage({
    imageRequest,

    referenceImages: [
      input.heroImageUrl,

      input.logoUrl,

      ...input.supportingHeroUrls,
    ],
  });

console.log("✅ IMAGE URL:", imageUrl);

    /**
 * STEP 4
 * Build Persistence Result
 */
const persistenceResult = {
  imageUrl,
  imageRequest,
  vision,
};

/**
 * STEP 5
 * Persist Campaign
 *
 * TODO:
 * Replace "demo-user" with authenticated user id
 * after JWT middleware is connected.
 */
const campaign =
  await campaignRepository.createCampaign(
    "demo-user",
    input,
    persistenceResult
  );

console.log("✅ CAMPAIGN SAVED:", campaign.id);

/**
 * STEP 6
 * API Response
 */
console.log("✅ RETURNING RESPONSE");

return {
  campaignId: campaign.id,
  imageUrl,
  imageRequest,
  vision,
};
  }

/**
 * ============================================================================
 * Get Campaign
 * ============================================================================
 */

public async getCampaign(
  campaignId: string
) {
  return campaignRepository.getCampaignById(
    campaignId
  );
}
}