import { PromptBlock } from "../blocks/promptBlockEngine";

export const CINEMATIC_SHADOW_PACK: PromptBlock[] = [
  {
    id: "cinematic-shadow-depth",

    type: "lighting",

    semanticRole: "lighting",

    label: "Cinematic Shadow Depth",

    cinematicWeight: 95,

    orchestrationPriority: 92,

    sectionPriority: 90,

    cinematicDominance: 88,

    fidelityCritical: false,

    narrativePurpose:
      "Create dramatic luxury shadow depth and cinematic dimensionality",

    sectionAffinity:
      "LIGHTING",

    tags: [
      "cinematic",
      "shadow",
      "luxury",
    ],

    positivePrompts: [
      "dramatic cinematic shadow depth",
      "luxury chiaroscuro lighting",
      "premium dimensional contrast",
      "editorial shadow sculpting",
      "cinematic luxury atmosphere",
    ],

    negativePrompts: [
      "flat lighting",
      "washed-out contrast",
    ],
  },
];