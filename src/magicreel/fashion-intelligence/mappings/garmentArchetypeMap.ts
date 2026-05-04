import { FashionCategory } from "../types/fashion.types";

export interface ArchetypeWeight {
  archetypeId: string;

  weight: number;
}

export interface GarmentArchetypeProfile {
  category: FashionCategory;

  primaryMood: string;

  luxuryTier: "premium" | "couture" | "ultra-luxury";

  archetypes: ArchetypeWeight[];

  cinematicDirection: string[];

  visualPriorities: string[];

  negativePriorities: string[];

  defaultLightingBehavior: string[];

  defaultCompositionBehavior: string[];

  emotionalObjectives: string[];
}

export const GARMENT_ARCHETYPE_MAP: Record<
  FashionCategory,
  GarmentArchetypeProfile
> = {
  lehenga: {
    category: "lehenga",

    primaryMood: "regal bridal grandeur",

    luxuryTier: "ultra-luxury",

    archetypes: [
      {
        archetypeId: "royal-heirloom",
        weight: 0.75,
      },
    ],

    cinematicDirection: [
      "cinematic bridal storytelling",
      "royal architectural framing",
      "museum-grade couture presentation",
    ],

    visualPriorities: [
      "embroidery preservation",
      "lehenga flare elegance",
      "premium jewelry integration",
      "regal posture language",
      "cinematic richness",
    ],

    negativePriorities: [
      "avoid influencer posing",
      "avoid fast-fashion energy",
      "avoid cheap wedding aesthetics",
      "avoid oversaturated glam edits",
    ],

    defaultLightingBehavior: [
      "warm luxury lighting",
      "royal depth shadows",
      "premium skin rendering",
    ],

    defaultCompositionBehavior: [
      "architectural symmetry",
      "foreground-background luxury layering",
      "couture-centric framing",
    ],

    emotionalObjectives: [
      "timeless luxury",
      "regal femininity",
      "bridal emotional grandeur",
    ],
  },

  saree: {
    category: "saree",

    primaryMood: "timeless feminine elegance",

    luxuryTier: "couture",

    archetypes: [
      {
        archetypeId: "royal-heirloom",
        weight: 0.55,
      },
    ],

    cinematicDirection: [
      "fluid drape storytelling",
      "soft cinematic femininity",
      "editorial elegance",
    ],

    visualPriorities: [
      "saree drape flow",
      "fabric movement",
      "graceful hand positioning",
      "premium textile richness",
    ],

    negativePriorities: [
      "avoid catalog poses",
      "avoid stiff body posture",
      "avoid artificial glam lighting",
    ],

    defaultLightingBehavior: [
      "soft diffused luxury lighting",
      "warm skin glow",
    ],

    defaultCompositionBehavior: [
      "fluid asymmetrical framing",
      "movement-driven composition",
    ],

    emotionalObjectives: [
      "grace",
      "timeless femininity",
      "luxury sophistication",
    ],
  },

  westernwear: {
    category: "westernwear",

    primaryMood: "modern editorial luxury",

    luxuryTier: "premium",

    archetypes: [
      {
        archetypeId: "royal-heirloom",
        weight: 0.15,
      },
    ],

    cinematicDirection: [
      "editorial campaign energy",
      "urban premium styling",
      "modern luxury framing",
    ],

    visualPriorities: [
      "clean silhouette rendering",
      "modern body language",
      "premium fabric depth",
    ],

    negativePriorities: [
      "avoid mall-fashion energy",
      "avoid influencer reel aesthetics",
      "avoid cheap commercial styling",
    ],

    defaultLightingBehavior: [
      "high-fashion soft lighting",
      "editorial contrast shaping",
    ],

    defaultCompositionBehavior: [
      "editorial asymmetry",
      "negative space sophistication",
    ],

    emotionalObjectives: [
      "confidence",
      "modern sophistication",
      "editorial elegance",
    ],
  },

  bridal: {
    category: "bridal",

    primaryMood: "cinematic couture bridal",

    luxuryTier: "ultra-luxury",

    archetypes: [
      {
        archetypeId: "royal-heirloom",
        weight: 0.85,
      },
    ],

    cinematicDirection: [
      "grand bridal storytelling",
      "heritage luxury framing",
      "cinematic emotional elegance",
    ],

    visualPriorities: [
      "couture preservation",
      "bridal emotional depth",
      "royal elegance",
    ],

    negativePriorities: [
      "avoid trendy social aesthetics",
      "avoid artificial posing",
    ],

    defaultLightingBehavior: [
      "museum-grade luxury lighting",
      "warm cinematic glow",
    ],

    defaultCompositionBehavior: [
      "symmetrical luxury composition",
      "architectural bridal staging",
    ],

    emotionalObjectives: [
      "timeless romance",
      "luxury grandeur",
      "cinematic emotion",
    ],
  },

  ethnicset: {
    category: "ethnicset",

    primaryMood: "modern ethnic elegance",

    luxuryTier: "premium",

    archetypes: [
      {
        archetypeId: "royal-heirloom",
        weight: 0.45,
      },
    ],

    cinematicDirection: [
      "modern festive storytelling",
      "premium ethnic editorial",
    ],

    visualPriorities: [
      "fabric richness",
      "clean ethnic styling",
      "modern femininity",
    ],

    negativePriorities: [
      "avoid ecommerce mannequin feel",
      "avoid cheap festive styling",
    ],

    defaultLightingBehavior: [
      "warm festive luxury lighting",
    ],

    defaultCompositionBehavior: [
      "editorial ethnic framing",
    ],

    emotionalObjectives: [
      "festive elegance",
      "premium femininity",
    ],
  },

  menswear: {
    category: "menswear",

    primaryMood: "heritage masculine luxury",

    luxuryTier: "couture",

    archetypes: [],

    cinematicDirection: [
      "royal masculine framing",
      "heritage sophistication",
    ],

    visualPriorities: [
      "structured posture",
      "tailoring precision",
      "luxury masculinity",
    ],

    negativePriorities: [
      "avoid casual slouching",
      "avoid streetwear energy",
    ],

    defaultLightingBehavior: [
      "structured cinematic shadows",
    ],

    defaultCompositionBehavior: [
      "strong symmetrical composition",
    ],

    emotionalObjectives: [
      "authority",
      "heritage elegance",
    ],
  },

  gown: {
    category: "gown",

    primaryMood: "couture evening elegance",

    luxuryTier: "ultra-luxury",

    archetypes: [],

    cinematicDirection: [
      "red carpet cinematic styling",
      "luxury couture posing",
    ],

    visualPriorities: [
      "silhouette elegance",
      "premium movement flow",
    ],

    negativePriorities: [
      "avoid pageant energy",
      "avoid influencer glamour",
    ],

    defaultLightingBehavior: [
      "high-fashion cinematic lighting",
    ],

    defaultCompositionBehavior: [
      "editorial couture staging",
    ],

    emotionalObjectives: [
      "confidence",
      "luxury glamour",
    ],
  },

  streetwear: {
    category: "streetwear",

    primaryMood: "editorial street luxury",

    luxuryTier: "premium",

    archetypes: [],

    cinematicDirection: [
      "urban editorial storytelling",
    ],

    visualPriorities: [
      "attitude",
      "street composition",
    ],

    negativePriorities: [
      "avoid cheap influencer energy",
    ],

    defaultLightingBehavior: [
      "urban cinematic contrast",
    ],

    defaultCompositionBehavior: [
      "editorial urban framing",
    ],

    emotionalObjectives: [
      "confidence",
      "individuality",
    ],
  },

  kurta: {
    category: "kurta",

    primaryMood: "heritage festive elegance",

    luxuryTier: "premium",

    archetypes: [],

    cinematicDirection: [
      "heritage festive storytelling",
    ],

    visualPriorities: [
      "fabric richness",
      "cultural sophistication",
    ],

    negativePriorities: [
      "avoid generic ecommerce styling",
    ],

    defaultLightingBehavior: [
      "warm cultural luxury lighting",
    ],

    defaultCompositionBehavior: [
      "clean heritage framing",
    ],

    emotionalObjectives: [
      "elegance",
      "festive sophistication",
    ],
  },
};