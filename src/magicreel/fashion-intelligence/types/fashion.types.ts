export type GenderMode =
  | "female"
  | "male"
  | "unisex";

export type FashionCategory =
  | "lehenga"
  | "saree"
  | "bridal"
  | "ethnicset"
  | "westernwear"
  | "menswear"
  | "gown"
  | "streetwear"
  | "kurta";

export type ArchetypeIntensity =
  | "soft"
  | "balanced"
  | "strong"
  | "extreme";

export type CameraLanguage =
  | "editorial"
  | "campaign"
  | "cinematic"
  | "luxury-commercial"
  | "portrait"
  | "runway";

export type LightingLanguage =
  | "warm-luxury"
  | "museum-grade"
  | "royal-moody"
  | "soft-diffused"
  | "natural-window"
  | "high-fashion"
  | "cinematic-shadow"
  | "golden-hour";

export type StylingLanguage =
  | "regal"
  | "heritage"
  | "royal"
  | "editorial"
  | "minimal"
  | "modern"
  | "sensual"
  | "street-luxury";

export type MotionLanguage =
  | "graceful"
  | "fluid"
  | "commanding"
  | "structured"
  | "soft-feminine"
  | "runway-power";

export interface VisualArchetype {
  id: string;

  name: string;

  description: string;

  genderMode: GenderMode[];

  compatibleCategories: FashionCategory[];

  intensity: ArchetypeIntensity;

  stylingLanguage: StylingLanguage[];

  cameraLanguage: CameraLanguage[];

  lightingLanguage: LightingLanguage[];

  motionLanguage: MotionLanguage[];

  keywords: string[];

  luxuryCodes: string[];

  visualRules: string[];

  poseRules: string[];

  compositionRules: string[];

  negativeRules: string[];

  cinematicReferences: string[];

  editorialReferences: string[];

  suitableOccasions: string[];

  textureBias: string[];

  colorBias: string[];

  emotionalTone: string[];

  priorityScore: number;
}