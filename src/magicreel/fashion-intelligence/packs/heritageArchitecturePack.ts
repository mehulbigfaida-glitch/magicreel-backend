import { PromptBlock } from "../blocks/promptBlockEngine";

export const HERITAGE_ARCHITECTURE_PACK: PromptBlock[] = [
  {
    id: "heritage-architecture-framing",

    type: "camera",

    semanticRole: "camera",

    label: "Heritage Architecture Framing",

    cinematicWeight: 98,

    orchestrationPriority: 100,

    sectionPriority: 95,

    cinematicDominance: 95,

    fidelityCritical: false,

    narrativePurpose:
      "Create regal heritage grandeur using architectural luxury framing",

    sectionAffinity:
      "CAMERA LANGUAGE",

    tags: [
      "royal",
      "heritage",
      "architecture",
      "luxury",
    ],

    positivePrompts: [
      "grand palace-inspired framing",
      "heritage architectural depth",
      "royal corridor composition",
      "luxury cinematic spatial layering",
      "museum-grade couture staging",
    ],

    negativePrompts: [
      "modern commercial interiors",
      "cheap wedding hall aesthetics",
    ],
  },
];