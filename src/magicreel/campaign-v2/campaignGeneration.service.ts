/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Generation Service
 * ============================================================================
 *
 * Orchestrates the complete Campaign Engine pipeline.
 *
 * Visual Intelligence
 *      ↓
 * Campaign Director
 *      ↓
 * Creative Director
 *      ↓
 * Prompt Builder
 *      ↓
 * Fal GPT Image 2.0
 *      ↓
 * Repository
 * ============================================================================
 */
console.log("CampaignGenerationService loaded");

import {
  CampaignPersistenceInput,
} from "./types/campaign.types";

import {
  CampaignGenerationResult,
  CampaignInput,
} from "./types/campaign.types";

import visualIntelligenceService from "./visual-intelligence/visualIntelligence.service";

import campaignDirectorService from "./campaign-director/campaignDirector.service";

import creativeDirectorService from "./creative-director/creativeDirector.service";

import promptBuilderService from "./prompt-builder/promptBuilder.service";

import {
  falImageProvider,
} from "../services/image-generation/providers/fal.provider";

import {
  campaignRepository,
} from "./repositories/campaign.repository";

export class CampaignGenerationService {

  private readonly campaignDirector =
  campaignDirectorService;

  /**
   * --------------------------------------------------------------------------
   * Generate Campaign
   * --------------------------------------------------------------------------
   */

  public async generateCampaign(
  userId: string,
  input: CampaignInput
): Promise<CampaignGenerationResult> {

console.log("===== CAMPAIGN SERVICE =====");
console.log("input =", input);

    /**
     * ------------------------------------------------------
     * Step 1
     * Visual Intelligence
     * ------------------------------------------------------
     */

    const visualResult =
      await visualIntelligenceService.analyzeProduct(
        input.heroImageUrl
      );

console.log("===== VISUAL ANALYSIS =====");
console.dir(visualResult, { depth: null });

    /**
     * ------------------------------------------------------
     * Step 2
     * Campaign Director
     * ------------------------------------------------------
     */

    const vision =
  await this.campaignDirector.createVision(
    input,
    visualResult.analysis
  );

    /**
     * ------------------------------------------------------
     * Step 3
     * Creative Director
     * ------------------------------------------------------
     */

    const creativeDirection =
      await creativeDirectorService.createCreativeDirection(
        input,
        vision
      );

    /**
     * ------------------------------------------------------
     * Step 4
     * Prompt Builder
     * ------------------------------------------------------
     */

    const imageRequest =
      promptBuilderService.buildPrompt(
        input,
        vision,
        creativeDirection
      );

    // Continue in Part 2...

        /**
     * ------------------------------------------------------
     * Step 5
     * Generate Campaign Image
     * ------------------------------------------------------
     */

    const generation =
      await falImageProvider.generateEditedImages({

        prompt: imageRequest.userPrompt,

        referenceImages: [
          input.heroImageUrl,
          ...input.supportingHeroUrls,
          input.logoUrl,
        ].filter(Boolean),

        numImages: 1,

        quality: "medium",

        outputFormat: "png",

      });

    if (
      !generation.images ||
      generation.images.length === 0
    ) {
      throw new Error(
        "Fal returned no campaign image."
      );
    }

    const finalImage =
      generation.images[0];

const persistence: CampaignPersistenceInput = {
  imageUrl: finalImage.url,
  imageRequest,
  vision,
};

const campaign =
  await campaignRepository.createCampaign(
    userId,
    input,
    persistence
  );

console.log("===== CAMPAIGN CREATED =====");
console.dir(campaign, { depth: null });

    /**
     * ------------------------------------------------------
     * Step 6
     * Persist Campaign
     * ------------------------------------------------------
     */

        
    /**
     * ------------------------------------------------------
     * Step 7
     * Return Result
     * ------------------------------------------------------
     */

        return {
      campaignId: campaign.id,
      imageUrl: finalImage.url,
      imageRequest,
      vision,
    };

  }

  public async getCampaign(
    campaignId: string
  ) {
    return campaignRepository.getCampaignById(
      campaignId
    );
  }

}

export default new CampaignGenerationService();