export type FashionLanguage =
  | "ethnic-luxury"
  | "contemporary-fashion"
  | "occasion-wear"
  | "ethnic-menswear"
  | "formal-menswear"
  | "layering";

export interface FashionLanguageProfile {
  id: FashionLanguage;

  displayName: string;

  emotionalDirection: string[];

  visualPriorities: string[];

  compositionDirection: string[];

  lightingDirection: string[];

  motionDirection: string[];

  poseDirection: string[];

  storytellingDirection: string[];

  activatedBlocks: string[];

  archetypeBias: string[];

  negativePriorities: string[];
}