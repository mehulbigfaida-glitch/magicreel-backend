import { PromptBlock } from "../blocks/promptBlockEngine";

export const EDITORIAL_MINIMAL_PACK: PromptBlock[] = [
  {
    id: "editorial-minimalism",

    type: "editorial",

    semanticRole: "editorial",

    label: "Editorial Minimalism",

    cinematicWeight: 90,

    orchestrationPriority: 82,

    sectionPriority: 70,

    cinematicDominance: 72,

    fidelityCritical: false,

    narrativePurpose:
      "Create refined luxury minimalism with clean editorial sophistication",

    sectionAffinity:
      "EDITORIAL COMPOSITION",

    tags: [
      "minimal",
      "editorial",
      "luxury",
    ],

    positivePrompts: [
      "clean luxury composition",
      "minimal editorial sophistication",
      "refined visual restraint",
      "premium minimalist staging",
      "quiet luxury aesthetics",
    ],

    negativePrompts: [
      "visual clutter",
      "oversaturated styling",
    ],
  },
];