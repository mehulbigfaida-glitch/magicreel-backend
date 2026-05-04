import { FashionCategory } from "../types/fashion.types";

import {
  orchestrateLuxuryPrompt,
} from "../orchestration/promptOrchestrator";

import {
  composeCinematicPrompt,
} from "../orchestration/cinematicPromptComposer";

export interface PromptPreviewResult {
  category: FashionCategory;

  orchestration: ReturnType<
    typeof orchestrateLuxuryPrompt
  >;

  composedPrompt: ReturnType<
    typeof composeCinematicPrompt
  >;
}

export function previewLuxuryPrompt(
  category: FashionCategory
): PromptPreviewResult {
  const orchestration =
    orchestrateLuxuryPrompt(category);

  const composedPrompt =
    composeCinematicPrompt(category);

  return {
    category,

    orchestration,

    composedPrompt,
  };
}