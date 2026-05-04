export type PromptBlockType =
  | "camera"
  | "lighting"
  | "composition"
  | "pose"
  | "emotion"
  | "motion"
  | "texture"
  | "styling"
  | "editorial"
  | "cinematic"
  | "negative";
  
export type SemanticRole =
  | "scene"
  | "camera"
  | "lighting"
  | "texture"
  | "pose"
  | "emotion"
  | "editorial"
  | "negative";

export interface PromptBlock {
  id: string;

  type: PromptBlockType;

  semanticRole: SemanticRole;

  label: string;

  cinematicWeight: number;

  orchestrationPriority: number;

  sectionPriority: number;

  cinematicDominance: number;

  fidelityCritical: boolean;

  narrativePurpose: string;

  sectionAffinity: string;

  tags: string[];

  compatibleCategories?: string[];

  compatibleArchetypes?: string[];

  positivePrompts: string[];

  negativePrompts?: string[];
}

export const PROMPT_BLOCKS: PromptBlock[] = [
  {
    id: "royal-cinematic-camera",

    type: "camera",

    semanticRole: "camera",

    label: "Royal Cinematic Camera Language",

    cinematicWeight: 95,

    orchestrationPriority: 100,

    sectionPriority: 90,

    cinematicDominance: 85,

    fidelityCritical: false,

    narrativePurpose:
      "Establish cinematic couture framing and luxury editorial depth",

    sectionAffinity:
      "CAMERA LANGUAGE",

    tags: [
      "cinematic",
      "royal",
      "editorial",
      "luxury",
    ],

    compatibleCategories: [
      "lehenga",
      "bridal",
      "saree",
    ],

    compatibleArchetypes: [
      "royal-heirloom",
    ],

    positivePrompts: [
      "museum-grade couture framing",
      "architectural depth composition",
      "premium editorial camera language",
      "luxury foreground-background separation",
      "high-end fashion campaign aesthetics",
    ],

    negativePrompts: [
      "cheap ecommerce framing",
      "catalog photography",
      "influencer camera angles",
    ],
  },

  {
    id: "warm-luxury-lighting",

    type: "lighting",

    semanticRole: "lighting",

    label: "Warm Luxury Lighting",

    cinematicWeight: 92,

    orchestrationPriority: 95,

    sectionPriority: 80,

    cinematicDominance: 78,

    fidelityCritical: false,

    narrativePurpose:
      "Create cinematic luxury depth and premium textile illumination",

    sectionAffinity:
      "LIGHTING",

    tags: [
      "lighting",
      "luxury",
      "cinematic",
    ],

    positivePrompts: [
      "warm cinematic luxury lighting",
      "premium shadow depth",
      "museum-grade skin rendering",
      "luxury textile highlights",
      "soft cinematic contrast",
    ],

    negativePrompts: [
      "flat lighting",
      "harsh flash lighting",
      "cheap glam lighting",
    ],
  },

  {
    id: "couture-pose-language",

    type: "pose",

    semanticRole: "pose",

    label: "Couture Pose Language",

    cinematicWeight: 90,

    orchestrationPriority: 88,

    sectionPriority: 65,

    cinematicDominance: 60,

    fidelityCritical: false,

    narrativePurpose:
      "Preserve elegant couture posture and luxury body language",

    sectionAffinity:
      "POSE AND MOVEMENT",

    tags: [
      "pose",
      "couture",
      "editorial",
    ],

    positivePrompts: [
      "elegant couture posture",
      "graceful wrist positioning",
      "elongated fashion posture",
      "controlled luxury body language",
    ],

    negativePrompts: [
      "awkward posing",
      "influencer pose energy",
      "casual social media posture",
    ],
  },

  {
    id: "editorial-composition",

    type: "composition",

    semanticRole: "editorial",

    label: "Editorial Composition System",

    cinematicWeight: 94,

    orchestrationPriority: 96,

    sectionPriority: 88,

    cinematicDominance: 82,

    fidelityCritical: false,

    narrativePurpose:
      "Establish premium editorial hierarchy and cinematic visual balance",

    sectionAffinity:
      "EDITORIAL COMPOSITION",

    tags: [
      "editorial",
      "composition",
      "luxury",
    ],

    positivePrompts: [
      "editorial luxury composition",
      "premium negative space",
      "cinematic depth layering",
      "high-fashion framing discipline",
      "luxury visual hierarchy",
    ],

    negativePrompts: [
      "cluttered composition",
      "busy framing",
      "low-end commercial staging",
    ],
  },

  {
    id: "textile-richness",

    type: "texture",

    semanticRole: "texture",

    label: "Luxury Textile Preservation",

    cinematicWeight: 97,

    orchestrationPriority: 100,

    sectionPriority: 100,

    cinematicDominance: 100,

    fidelityCritical: true,

    narrativePurpose:
      "Preserve couture embroidery fidelity and luxury textile realism",

    sectionAffinity:
      "TEXTURE AND GARMENT FIDELITY",

    tags: [
      "textile",
      "embroidery",
      "couture",
    ],

    positivePrompts: [
      "preserve embroidery fidelity",
      "luxury textile richness",
      "premium fabric dimensionality",
      "realistic couture texture rendering",
      "detailed fabric realism",
    ],

    negativePrompts: [
      "plastic fabric rendering",
      "texture smoothing",
      "low-detail textile rendering",
    ],
  },

  {
    id: "cinematic-emotion",

    type: "emotion",

    semanticRole: "emotion",

    label: "Luxury Emotional Storytelling",

    cinematicWeight: 85,

    orchestrationPriority: 82,

    sectionPriority: 50,

    cinematicDominance: 45,

    fidelityCritical: false,

    narrativePurpose:
      "Create emotionally elevated luxury storytelling",

    sectionAffinity:
      "EMOTIONAL TONE",

    tags: [
      "emotion",
      "cinematic",
      "luxury",
    ],

    positivePrompts: [
      "emotionally elevated fashion storytelling",
      "timeless luxury emotion",
      "aspirational elegance",
      "premium cinematic mood",
    ],

    negativePrompts: [
      "generic social media emotion",
      "cheap commercial mood",
    ],
  },

  {
    id: "luxury-negative-enforcement",

    type: "negative",

    semanticRole: "negative",

    label: "Luxury Quality Enforcement",

    cinematicWeight: 100,

    orchestrationPriority: 100,

    sectionPriority: 100,

    cinematicDominance: 100,

    fidelityCritical: true,

    narrativePurpose:
      "Suppress low-end aesthetics and enforce luxury realism",

    sectionAffinity:
      "NEGATIVE ENFORCEMENT",

    tags: [
      "negative",
      "quality-control",
    ],

    positivePrompts: [],

    negativePrompts: [
      "cheap influencer aesthetics",
      "fast-fashion visuals",
      "TikTok styling",
      "plastic AI skin",
      "oversaturated glam",
      "catalog photography",
      "mall-fashion energy",
      "awkward anatomy",
      "artificial posing",
      "cheap wedding photography",
    ],
  },
];