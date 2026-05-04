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
  resolveDynamicBlocks,
} from "./dynamicBlockActivation";

import {
  resolveInjectedPacks,
} from "./packInjectionEngine";

import {
  PromptBlock,
  SemanticRole,
} from "../blocks/promptBlockEngine";

export interface CinematicPromptV8Result {
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
  return `A ${
    context.mood || "luxury"
  } ${
    context.category
  } cinematic fashion campaign portrait with ${cinematicTone}, premium luxury storytelling, and editorial couture realism`;
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

function extractFragments(
  blocks: PromptBlock[]
): string[] {
  return unique(
    blocks.flatMap(
      (block) => block.positivePrompts
    )
  );
}

function filterBlocksByRole(
  blocks: PromptBlock[],
  role: SemanticRole
): PromptBlock[] {
  return blocks.filter(
    (block) =>
      block.semanticRole === role
  );
}

export function composeCinematicPromptV8(
  context: PromptContext
): CinematicPromptV8Result {
  const orchestration =
    orchestrateLuxuryPrompt(
      context.category
    );

  const contextProfile =
    resolveContextProfile(context);

  const dynamicBlocks =
    resolveDynamicBlocks(
      context,
      orchestration.activatedBlocks
    );

  const injectedBlocks =
    resolveInjectedPacks(context);

  const resolvedBlocks = [
    ...dynamicBlocks.map(
      (entry) => entry.block
    ),

    ...injectedBlocks,
  ];

  const textureBlocks =
    filterBlocksByRole(
      resolvedBlocks,
      "texture"
    );

  const cameraBlocks =
    filterBlocksByRole(
      resolvedBlocks,
      "camera"
    );

  const lightingBlocks =
    filterBlocksByRole(
      resolvedBlocks,
      "lighting"
    );

  const editorialBlocks =
    filterBlocksByRole(
      resolvedBlocks,
      "editorial"
    );

  const poseBlocks =
    filterBlocksByRole(
      resolvedBlocks,
      "pose"
    );

  const emotionBlocks =
    filterBlocksByRole(
      resolvedBlocks,
      "emotion"
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

        contextProfile.compositionStyle,
      ]
    ),

    buildSection(
      "LIGHTING",
      [
        ...extractFragments(lightingBlocks),

        contextProfile.lightingStyle,
      ]
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
      "LUXURY STANDARDS",
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