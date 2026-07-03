
/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Types
 * ============================================================================
 */

/**
 * --------------------------------------------------------------------------
 * User Input
 * --------------------------------------------------------------------------
 */

export interface CampaignInput {
  heroImageUrl: string;

  /**
   * Up to 4 previously generated Hero Assets
   */
  supportingHeroUrls: string[];

  logoUrl: string;

  headline: string;

  subheadline?: string;

  cta?: string;
}

/**
 * --------------------------------------------------------------------------
 * Creative Vision
 * --------------------------------------------------------------------------
 */

export interface CreativeVision {
  creativeDirection: string;

  composition: string;

  visualMood: string;

  hierarchy: string;

  typographyStyle: string;

  logoPlacement: string;
}

/**
 * --------------------------------------------------------------------------
 * Prompt Builder Input
 * --------------------------------------------------------------------------
 */

export interface PromptBuildInput {
  heroImageUrl: string;

  /**
   * Up to 4 previously generated Hero Assets
   */
  supportingHeroUrls: string[];

  logoUrl: string;

  headline: string;

  subheadline?: string;

  cta?: string;

  vision: CreativeVision;
}

/**
 * --------------------------------------------------------------------------
 * Image Generation Request
 * --------------------------------------------------------------------------
 */

export interface ImageGenerationRequest {
  systemPrompt: string;

  userPrompt: string;
}

/**
 * --------------------------------------------------------------------------
 * Campaign Image Generation Input
 * --------------------------------------------------------------------------
 */

export interface CampaignImageGenerationInput {
  imageRequest: ImageGenerationRequest;

  referenceImages: string[];
}

/**
 * --------------------------------------------------------------------------
 * Repository Persistence Input
 * --------------------------------------------------------------------------
 */

export interface CampaignPersistenceInput {
  imageUrl: string;

  imageRequest: ImageGenerationRequest;

  vision: CreativeVision;
}

/**
 * --------------------------------------------------------------------------
 * Final Campaign Output
 * --------------------------------------------------------------------------
 */

export interface CampaignGenerationResult {
  /**
   * Persisted Campaign Id
   */
  campaignId: string;

  /**
   * Final generated campaign image
   */
  imageUrl: string;

  /**
   * Complete prompt sent to image engine
   */
  imageRequest: ImageGenerationRequest;

  /**
   * Creative direction returned by Campaign Director
   */
  vision: CreativeVision;
}

