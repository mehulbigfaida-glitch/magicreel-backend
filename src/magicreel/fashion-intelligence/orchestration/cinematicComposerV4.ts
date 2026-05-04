import { FashionCategory } from "../types/fashion.types";

import {
  orchestrateLuxuryPrompt,
} from "./promptOrchestrator";

import {
  PROMPT_BLOCKS,
  SemanticRole,
} from "../blocks/promptBlockEngine";

export interface CinematicPromptV4Result {
  category: FashionCategory;

  cinematicTone: string;

  positivePrompt: string;

  negativePrompt: string;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function buildSceneIntro(
  category: FashionCategory,
  cinematicTone: string
): string {
  switch (category) {
    case "lehenga":
      return `A regal couture bridal fashion portrait featuring heirloom lehenga craftsmanship with emotionally elevated luxury storytelling and ${cinematicTone}`;

    case "saree":
      return `A timeless luxury saree editorial portrait with graceful feminine elegance and cinematic sophistication`;

    case "menswear":
      return `A heritage-inspired luxury menswear editorial portrait with refined masculine authority and cinematic tailoring precision`;

    case "westernwear":
      return `A modern luxury fashion editorial portrait with elevated contemporary styling and premium editorial confidence`;

    case "bridal":
      return `A cinematic bridal couture campaign portrait with regal elegance and emotionally rich luxury storytelling`;

    default:
      return `A premium cinematic luxury fashion editorial portrait`;
  }
}

function buildSemanticSection(
  title: string,
  fragments: string[]
): string {
  if (!fragments.length) {
    return "";
  }

  return `${title}: ${unique(fragments).join(", ")}`;
}

function resolveSemanticFragments(
  activatedBlocks: string[],
  role: SemanticRole
): string[] {
  return PROMPT_BLOCKS
    .filter(
      (block) =>
        activatedBlocks.includes(block.id) &&
        block.semanticRole === role
    )
    .sort(
      (a, b) =>
        b.orchestrationPriority -
        a.orchestrationPriority
    )
    .flatMap(
      (block) => block.positivePrompts
    );
}

export function composeCinematicPromptV4(
  category: FashionCategory
): CinematicPromptV4Result {
  const orchestration =
    orchestrateLuxuryPrompt(category);

  const cameraFragments =
    resolveSemanticFragments(
      orchestration.activatedBlocks,
      "camera"
    );

  const lightingFragments =
    resolveSemanticFragments(
      orchestration.activatedBlocks,
      "lighting"
    );

  const textureFragments =
    resolveSemanticFragments(
      orchestration.activatedBlocks,
      "texture"
    );

  const poseFragments =
    resolveSemanticFragments(
      orchestration.activatedBlocks,
      "pose"
    );

  const emotionFragments =
    resolveSemanticFragments(
      orchestration.activatedBlocks,
      "emotion"
    );

  const editorialFragments =
    resolveSemanticFragments(
      orchestration.activatedBlocks,
      "editorial"
    );

  const positiveSections = [
    buildSceneIntro(
      category,
      orchestration.cinematicTone
    ),

    buildSemanticSection(
      "CAMERA LANGUAGE",
      cameraFragments
    ),

    buildSemanticSection(
      "LIGHTING",
      lightingFragments
    ),

    buildSemanticSection(
      "TEXTURE AND GARMENT FIDELITY",
      textureFragments
    ),

    buildSemanticSection(
      "POSE AND MOVEMENT",
      poseFragments
    ),

    buildSemanticSection(
      "EMOTIONAL TONE",
      emotionFragments
    ),

    buildSemanticSection(
      "EDITORIAL COMPOSITION",
      editorialFragments
    ),

    buildSemanticSection(
      "EDITORIAL LUXURY STANDARDS",
      orchestration.luxuryRules
    ),
  ].filter(Boolean);

  const negativePrompt =
    unique(
      orchestration.negativePromptFragments
    ).join(", ");

  return {
    category,

    cinematicTone:
      orchestration.cinematicTone,

    positivePrompt:
      positiveSections.join(". "),

    negativePrompt,
  };
}