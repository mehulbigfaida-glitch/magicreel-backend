import { PromptBlock } from "../blocks/promptBlockEngine";

export const RUNWAY_MOTION_PACK: PromptBlock[] = [
  {
    id: "runway-motion-energy",

    type: "motion",

    semanticRole: "pose",

    label: "Runway Motion Energy",

    cinematicWeight: 92,

    orchestrationPriority: 88,

    sectionPriority: 75,

    cinematicDominance: 80,

    fidelityCritical: false,

    narrativePurpose:
      "Create cinematic runway confidence and luxury movement rhythm",

    sectionAffinity:
      "POSE AND MOVEMENT",

    tags: [
      "runway",
      "motion",
      "editorial",
      "luxury",
    ],

    positivePrompts: [
      "confident runway stride",
      "controlled couture motion",
      "editorial movement rhythm",
      "luxury runway pacing",
      "cinematic fashion walk energy",
    ],

    negativePrompts: [
      "chaotic motion",
      "fast uncontrolled movement",
    ],
  },
];