import { PromptBlock } from "../blocks/promptBlockEngine";

export const BRIDAL_JEWELRY_PACK: PromptBlock[] = [
  {
    id: "bridal-jewelry-richness",

    type: "texture",

    semanticRole: "texture",

    label: "Bridal Jewelry Richness",

    cinematicWeight: 96,

    orchestrationPriority: 98,

    sectionPriority: 96,

    cinematicDominance: 94,

    fidelityCritical: true,

    narrativePurpose:
      "Enhance bridal couture richness using premium jewelry realism",

    sectionAffinity:
      "TEXTURE AND GARMENT FIDELITY",

    tags: [
      "bridal",
      "jewelry",
      "couture",
      "luxury",
    ],

    positivePrompts: [
      "heritage bridal jewelry realism",
      "luxury gemstone detailing",
      "premium bridal ornament richness",
      "cinematic jewelry highlights",
      "royal bridal accessory elegance",
    ],

    negativePrompts: [
      "cheap artificial jewelry",
      "plastic ornament rendering",
    ],
  },
];