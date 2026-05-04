export type SocialCreativeGoal =
  | "lookbook"
  | "instagram"
  | "tradeshow"
  | "sale"
  | "reel-cover";

export type CreativeDirection =
  | "Luxury Editorial"
  | "Streetwear"
  | "Minimal Fashion"
  | "Festive Couture"
  | "High Fashion";

export type SocialElement =
  | "Handbag"
  | "Jewellery"
  | "Sunglasses"
  | "Watch"
  | "Studio Props"
  | "High Heels";

export interface SocialPackInput {
  creativeGoal: SocialCreativeGoal;

  creativeDirection: CreativeDirection;

  brandName?: string;

  heading?: string;

  subheading?: string;

  elements?: SocialElement[];

  replaceBackground?: boolean;

  backgroundPrompt?: string;
}

export interface ResolvedCreativeDirection {
  cinematicTone: string;

  luxuryMood: string;

  compositionStyle: string;

  lightingStyle: string;

  visualAtmosphere: string;

  stylingBehavior: string[];

  cinematicKeywords: string[];

  negativeKeywords: string[];
}

export interface ResolvedCampaignGoal {
  compositionBehavior: string[];

  typographyBehavior: string[];

  marketingBehavior: string[];

  outputIntent: string;
}

export interface GeminiPromptPayload {
  systemPrompt: string;

  userPrompt: string;

  creativeSummary: string;
}