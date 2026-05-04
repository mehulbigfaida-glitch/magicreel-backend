import { FashionCategory } from "../types/fashion.types";

import {
  orchestrateLuxuryPrompt,
} from "./promptOrchestrator";

import {
  PROMPT_BLOCKS,
  PromptBlock,
  SemanticRole,
} from "../blocks/promptBlockEngine";

export interface CinematicPromptV5Result {
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
      return `A timeless luxury saree editorial portrait with graceful femininity and cinematic sophistication`;

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

function buildSection(
  title: string,
  fragments: string[]
): string {
  if (!fragments.length) {
    return "";
  }

  return `${title}: ${unique(fragments).join(", ")}`;
}

function resolveWeightedBlocks(
  activatedBlocks: string[],
  role: SemanticRole
): PromptBlock[] {
  return PROMPT_BLOCKS
    .filter(
      (block) =>
        activatedBlocks.includes(block.id) &&
        block.semanticRole === role
    )
    .sort((a, b) => {
      if (
        a.fidelityCritical &&
        !b.fidelityCritical
      ) {
        return -1;
      }

      if (
        !a.fidelityCritical &&
        b.fidelityCritical
      ) {
        return 1;
      }

      return (
        b.cinematicDominance -
        a.cinematicDominance
      );
    });
}

function extractFragments(
  blocks: PromptBlock[]
): string[] {
  return unique(
    blocks.flatMap(
      (block) => block.positivePrompts
    )
  );
}

export function composeCinematicPromptV5(
  category: FashionCategory
): CinematicPromptV5Result {
  const orchestration =
    orchestrateLuxuryPrompt(category);

  const cameraBlocks =
    resolveWeightedBlocks(
      orchestration.activatedBlocks,
      "camera"
    );

  const lightingBlocks =
    resolveWeightedBlocks(
      orchestration.activatedBlocks,
      "lighting"
    );

  const textureBlocks =
    resolveWeightedBlocks(
      orchestration.activatedBlocks,
      "texture"
    );

  const poseBlocks =
    resolveWeightedBlocks(
      orchestration.activatedBlocks,
      "pose"
    );

  const emotionBlocks =
    resolveWeightedBlocks(
      orchestration.activatedBlocks,
      "emotion"
    );

  const editorialBlocks =
    resolveWeightedBlocks(
      orchestration.activatedBlocks,
      "editorial"
    );

  const positiveSections = [
    buildSceneIntro(
      category,
      orchestration.cinematicTone
    ),

    buildSection(
      "TEXTURE AND GARMENT FIDELITY",
      extractFragments(textureBlocks)
    ),

    buildSection(
      "CAMERA LANGUAGE",
      extractFragments(cameraBlocks)
    ),

    buildSection(
      "LIGHTING",
      extractFragments(lightingBlocks)
    ),

    buildSection(
      "EDITORIAL COMPOSITION",
      extractFragments(editorialBlocks)
    ),

    buildSection(
      "POSE AND MOVEMENT",
      extractFragments(poseBlocks)
    ),

    buildSection(
      "EMOTIONAL TONE",
      extractFragments(emotionBlocks)
    ),

    buildSection(
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