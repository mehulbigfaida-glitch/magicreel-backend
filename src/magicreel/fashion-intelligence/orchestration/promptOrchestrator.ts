import { FashionCategory } from "../types/fashion.types";

import { resolveDirector } from "../resolvers/directorResolver";

import { PROMPT_BLOCKS } from "../blocks/promptBlockEngine";

import { GLOBAL_LUXURY_RULES } from "../rules/globalLuxuryRules";

export interface PromptOrchestrationResult {
  category: FashionCategory;

  directorId: string;

  cinematicTone: string;

  archetypes: string[];

  activatedBlocks: string[];

  positivePromptFragments: string[];

  negativePromptFragments: string[];

  luxuryRules: string[];
}

export function orchestrateLuxuryPrompt(
  category: FashionCategory
): PromptOrchestrationResult {
  const director = resolveDirector(category);

  const resolvedBlocks = PROMPT_BLOCKS.filter(
    (block) =>
      director.activatedBlocks.includes(block.id)
  );

  const positivePromptFragments =
    resolvedBlocks.flatMap(
      (block) => block.positivePrompts
    );

  const negativePromptFragments =
    resolvedBlocks.flatMap(
      (block) => block.negativePrompts || []
    );

  return {
    category,

    directorId: director.directorId,

    cinematicTone: director.cinematicTone,

    archetypes: director.archetypeBias,

    activatedBlocks: director.activatedBlocks,

    positivePromptFragments: [
      ...positivePromptFragments,
    ],

    negativePromptFragments: [
      ...negativePromptFragments,
    ],

    luxuryRules: [
      ...GLOBAL_LUXURY_RULES.visualIntegrityRules,
      ...GLOBAL_LUXURY_RULES.garmentPreservationRules,
      ...GLOBAL_LUXURY_RULES.editorialStandards,
    ],
  };
}