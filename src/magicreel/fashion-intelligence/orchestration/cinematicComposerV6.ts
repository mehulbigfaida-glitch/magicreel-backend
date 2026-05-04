import {
  PromptContext,
} from "../types/context.types";

import {
  orchestrateLuxuryPrompt,
} from "./promptOrchestrator";

import {
  resolveContextProfile,
} from "../resolvers/contextResolver";

import {
  PROMPT_BLOCKS,
  PromptBlock,
  SemanticRole,
} from "../blocks/promptBlockEngine";

export interface CinematicPromptV6Result {
  context: PromptContext;

  cinematicTone: string;

  positivePrompt: string;

  negativePrompt: string;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function buildSceneIntro(
  context: PromptContext,
  cinematicTone: string
): string {
  const mood =
    context.mood || "editorial";

  const occasion =
    context.occasion || "editorial";

  switch (context.category) {
    case "lehenga":
      return `A ${mood} couture lehenga campaign portrait with emotionally elevated ${occasion} storytelling and ${cinematicTone}`;

    case "saree":
      return `A luxurious cinematic saree editorial portrait with graceful feminine sophistication and ${mood} elegance`;

    case "menswear":
      return `A heritage-inspired luxury menswear editorial portrait with refined masculine authority and cinematic sophistication`;

    case "westernwear":
      return `A modern luxury fashion editorial portrait with elevated contemporary styling and premium cinematic confidence`;

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

export function composeCinematicPromptV6(
  context: PromptContext
): CinematicPromptV6Result {
  const orchestration =
    orchestrateLuxuryPrompt(
      context.category
    );

  const contextProfile =
    resolveContextProfile(context);

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
      context,
      orchestration.cinematicTone
    ),

    buildSection(
      "TEXTURE AND GARMENT FIDELITY",
      extractFragments(textureBlocks)
    ),

    buildSection(
      "CAMERA LANGUAGE",
      [
        ...extractFragments(cameraBlocks),

        `${contextProfile.compositionStyle}`,
      ]
    ),

    buildSection(
      "LIGHTING",
      [
        ...extractFragments(lightingBlocks),

        `${contextProfile.lightingStyle}`,
      ]
    ),

    buildSection(
      "EDITORIAL COMPOSITION",
      extractFragments(editorialBlocks)
    ),

    buildSection(
      "POSE AND MOVEMENT",
      [
        ...extractFragments(poseBlocks),

        `cinematic motion intensity ${contextProfile.motionIntensity}`,
      ]
    ),

    buildSection(
      "EMOTIONAL TONE",
      [
        ...extractFragments(emotionBlocks),

        `luxury emotional intensity ${contextProfile.emotionalIntensity}`,
      ]
    ),

    buildSection(
      "LUXURY AMPLIFICATION",
      [
        `luxury amplification level ${contextProfile.luxuryAmplification}`,

        `editorial strength ${contextProfile.editorialStrength}`,

        `heritage richness ${contextProfile.heritageStrength}`,

        `cinematic intensity ${contextProfile.cinematicIntensity}`,
      ]
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
    context,

    cinematicTone:
      orchestration.cinematicTone,

    positivePrompt:
      positiveSections.join(". "),

    negativePrompt,
  };
}