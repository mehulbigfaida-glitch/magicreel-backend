// ============================================================================
// MagicReel Campaign Engine V2
// campaign-v2/models/campaign.types.ts
// ============================================================================

/**
 * Master Campaign Types
 *
 * These interfaces are the common language shared between:
 *
 * Visual Intelligence
 * ↓
 * Campaign Director
 * ↓
 * Creative Director
 * ↓
 * Prompt Builder
 * ↓
 * GPT Image 2
 *
 * IMPORTANT:
 * This file must remain framework-independent.
 * No business logic.
 * No implementation.
 * Only shared contracts.
 */

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export type CampaignObjective =
  | "launch"
  | "promotion"
  | "sale"
  | "branding"
  | "editorial"
  | "awareness"
  | "festival"
  | "luxury"
  | "collection"
  | "social";

export type CampaignPlatform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "pinterest"
  | "website"
  | "amazon"
  | "flipkart"
  | "shopify"
  | "print"
  | "marketplace";

export type CampaignTone =
  | "luxury"
  | "premium"
  | "editorial"
  | "minimal"
  | "playful"
  | "bold"
  | "elegant"
  | "dramatic"
  | "cinematic"
  | "festive";

export type LuxuryLevel =
  | "commercial"
  | "premium"
  | "luxury"
  | "couture";

export type AspectRatio =
  | "1:1"
  | "4:5"
  | "9:16"
  | "16:9"
  | "3:4";

// -----------------------------------------------------------------------------
// User Request
// -----------------------------------------------------------------------------

export interface CampaignRequest {
  productImage: string;

  brandName?: string;

  campaignName?: string;

  productName?: string;

  category?: string;

  targetAudience?: string;

  objective: CampaignObjective;

  platform: CampaignPlatform;

  tone?: CampaignTone;

  season?: string;

  festival?: string;

  region?: string;

  aspectRatio?: AspectRatio;

  additionalInstructions?: string;
}

// -----------------------------------------------------------------------------
// Visual Intelligence Output
// -----------------------------------------------------------------------------

export interface VisualProfile {
  category: string;

  garmentType?: string;

  dominantColors: string[];

  secondaryColors: string[];

  material?: string;

  texture?: string;

  silhouette?: string;

  pattern?: string;

  embellishment?: string;

  fit?: string;

  neckline?: string;

  sleeveType?: string;

  luxuryIndicators: string[];

  visualKeywords: string[];

  confidence: number;
}

// -----------------------------------------------------------------------------
// Campaign Strategy
// -----------------------------------------------------------------------------

export interface CampaignStrategy {
  objective: CampaignObjective;

  audience: string;

  platform: CampaignPlatform;

  communicationGoal: string;

  heroMessage: string;

  emotionalHook: string;

  luxuryLevel: LuxuryLevel;
}

// -----------------------------------------------------------------------------
// Creative Brief
// -----------------------------------------------------------------------------

export interface CreativeBrief {
  mood: string;

  story: string;

  lighting: string;

  composition: string;

  cameraAngle: string;

  lens: string;

  environment: string;

  styling: string;

  pose: string;

  colorPalette: string[];

  editorialWorld: string;

  negativeSpace: boolean;

  premiumDetails: string[];

  visualKeywords: string[];
}

// -----------------------------------------------------------------------------
// Prompt Builder Output
// -----------------------------------------------------------------------------

export interface PromptPayload {
  prompt: string;

  negativePrompt?: string;

  aspectRatio: AspectRatio;

  model: string;

  quality: "standard" | "high";
}

// -----------------------------------------------------------------------------
// Final Generated Campaign
// -----------------------------------------------------------------------------

export interface GeneratedCampaign {
  campaignId: string;

  imageUrl: string;

  cloudinaryUrl?: string;

  prompt: string;

  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Pipeline Context
// -----------------------------------------------------------------------------

export interface CampaignContext {
  request: CampaignRequest;

  visualProfile?: VisualProfile;

  strategy?: CampaignStrategy;

  creativeBrief?: CreativeBrief;

  prompt?: PromptPayload;

  output?: GeneratedCampaign;
}