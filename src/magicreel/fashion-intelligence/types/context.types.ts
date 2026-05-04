import { FashionCategory } from "./fashion.types";

export type FashionMood =
  | "royal"
  | "editorial"
  | "minimal"
  | "romantic"
  | "heritage"
  | "modern"
  | "festive"
  | "cinematic"
  | "soft-luxury";

export type CampaignType =
  | "bridal-campaign"
  | "couture-editorial"
  | "festive-campaign"
  | "runway"
  | "lookbook"
  | "luxury-commercial";

export type LuxuryTier =
  | "premium"
  | "couture"
  | "ultra-luxury";

export type OccasionType =
  | "bridal"
  | "engagement"
  | "festive"
  | "cocktail"
  | "reception"
  | "editorial"
  | "runway";

export interface PromptContext {
  category: FashionCategory;

  mood?: FashionMood;

  campaignType?: CampaignType;

  luxuryTier?: LuxuryTier;

  occasion?: OccasionType;
}