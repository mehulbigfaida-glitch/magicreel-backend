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

export interface SocialPackPayload {
  creativeGoal: SocialCreativeGoal;

  creativeDirection: CreativeDirection;

  brandName?: string;

  heading?: string;

  subheading?: string;

  elements?: SocialElement[];

  replaceBackground?: boolean;

  backgroundPrompt?: string;
}