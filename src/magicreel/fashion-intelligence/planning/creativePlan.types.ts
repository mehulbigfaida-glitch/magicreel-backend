import { FashionCategory } from "../types/fashion.types";


export interface CreativePlan {
  metadata: CreativeMetadata;

  identity: CreativeIdentity;

  creativeGoal: CreativeGoal;

  camera: CameraDirection;

  lighting: LightingDirection;

  composition: CompositionDirection;

  styling: StylingDirection;

  background: BackgroundDirection;

  accessories: AccessoryDirection;

  model: ModelDirection;

  emotion: EmotionDirection;

  storytelling: StoryDirection;

  quality: QualityDirection;

  packs: PackSelection;

  rules: RuleSelection;
}

/* -------------------------------------------------- */

export interface CreativeMetadata {
  version: string;

  category: FashionCategory;

  campaignType: string;

  outputType: string;
}

/* -------------------------------------------------- */

export interface CreativeIdentity {
  director: string;

  brandDNA: string;

  luxuryTier: string;

  editorialStyle: string;
}

/* -------------------------------------------------- */

export interface CreativeGoal {
  objective: string;

  audience: string;

  visualPriority: string[];
}

/* -------------------------------------------------- */

export interface CameraDirection {
  framing: string;

  angle: string;

  lensStyle: string;

  distance: string;

  movement: string;
}

/* -------------------------------------------------- */

export interface LightingDirection {
  style: string;

  mood: string;

  contrast: string;

  highlights: string;
}

/* -------------------------------------------------- */

export interface CompositionDirection {
  layout: string;

  balance: string;

  focus: string;

  depth: string;
}

/* -------------------------------------------------- */

export interface StylingDirection {
  wardrobePriority: string[];

  accessoryPolicy: string;

  colorStrategy: string;
}

/* -------------------------------------------------- */

export interface BackgroundDirection {
  environment: string;

  architecture: string;

  atmosphere: string;
}

/* -------------------------------------------------- */

export interface AccessoryDirection {

  jewellery: string[];

  footwear: string[];

  handAccessories: string[];

  hairStyling: string[];

  beauty: string[];

  luxuryRules: string[];

  prohibited: string[];

}

/* -------------------------------------------------- */

export interface ModelDirection {
  pose: string;

  expression: string;

  bodyLanguage: string;
}

/* -------------------------------------------------- */

export interface EmotionDirection {
  emotionalTone: string;

  energy: string;
}

/* -------------------------------------------------- */

export interface StoryDirection {
  narrative: string;

  cinematicMoment: string;
}

/* -------------------------------------------------- */

export interface QualityDirection {
  preserveGarment: boolean;

  preserveEmbroidery: boolean;

  preserveSilhouette: boolean;

  avoidArtifacts: boolean;
}

/* -------------------------------------------------- */

export interface PackSelection {
  recommended: string[];

  optional: string[];
}

/* -------------------------------------------------- */

export interface RuleSelection {
  required: string[];

  prohibited: string[];
}