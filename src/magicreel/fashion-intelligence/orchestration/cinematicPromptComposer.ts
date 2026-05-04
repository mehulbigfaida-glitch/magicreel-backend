import { FashionCategory } from "../types/fashion.types";

import {
  orchestrateLuxuryPrompt,
} from "./promptOrchestrator";

export interface CinematicPromptResult {
  category: FashionCategory;

  cinematicTone: string;

  positivePrompt: string;

  negativePrompt: string;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function composeCinematicPrompt(
  category: FashionCategory
): CinematicPromptResult {
  const orchestration =
    orchestrateLuxuryPrompt(category);

  const positiveFragments = unique([
    orchestration.cinematicTone,

    ...orchestration.positivePromptFragments,

    ...orchestration.luxuryRules,
  ]);

  const negativeFragments = unique([
    ...orchestration.negativePromptFragments,
  ]);

  const positivePrompt =
    positiveFragments.join(", ");

  const negativePrompt =
    negativeFragments.join(", ");

  return {
    category,

    cinematicTone:
      orchestration.cinematicTone,

    positivePrompt,

    negativePrompt,
  };
}