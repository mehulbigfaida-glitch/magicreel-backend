import { FashionCategory } from "../types/fashion.types";

import {
  orchestrateLuxuryPrompt,
} from "./promptOrchestrator";

export interface CinematicPromptV2Result {
  category: FashionCategory;

  cinematicTone: string;

  positivePrompt: string;

  negativePrompt: string;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function buildNarrativeIntro(
  category: FashionCategory,
  cinematicTone: string
): string {
  switch (category) {
    case "lehenga":
      return `A regal couture bridal fashion portrait featuring heirloom lehenga craftsmanship, ${cinematicTone}`;

    case "saree":
      return `A timeless luxury saree editorial portrait with graceful feminine elegance, ${cinematicTone}`;

    case "menswear":
      return `A heritage-inspired luxury menswear editorial portrait with refined masculine sophistication, ${cinematicTone}`;

    case "westernwear":
      return `A modern luxury fashion editorial with elevated contemporary styling, ${cinematicTone}`;

    case "bridal":
      return `A cinematic bridal couture campaign portrait with emotionally elevated luxury storytelling, ${cinematicTone}`;

    default:
      return `A premium luxury fashion editorial portrait, ${cinematicTone}`;
  }
}

export function composeCinematicPromptV2(
  category: FashionCategory
): CinematicPromptV2Result {
  const orchestration =
    orchestrateLuxuryPrompt(category);

  const positiveFragments = unique([
    ...orchestration.positivePromptFragments,

    ...orchestration.luxuryRules,
  ]);

  const negativeFragments = unique([
    ...orchestration.negativePromptFragments,
  ]);

  const narrativeIntro =
    buildNarrativeIntro(
      category,
      orchestration.cinematicTone
    );

  const positivePrompt = [
    narrativeIntro,

    positiveFragments.join(", "),
  ].join(", ");

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