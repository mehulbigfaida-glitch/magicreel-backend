import {
  PromptContext,
} from "../types/context.types";

import {
  PROMPT_BLOCKS,
  PromptBlock,
} from "../blocks/promptBlockEngine";

export interface ActivatedBlock {
  block: PromptBlock;

  activationScore: number;
}

function calculateContextBonus(
  context: PromptContext,
  block: PromptBlock
): number {
  let score = 0;

  const mood =
    context.mood || "editorial";

  const campaign =
    context.campaignType ||
    "couture-editorial";

  const luxuryTier =
    context.luxuryTier ||
    "couture";

  const occasion =
    context.occasion ||
    "editorial";

  // ROYAL / HERITAGE BOOST

  if (
    mood === "royal" &&
    (
      block.tags.includes("royal") ||
      block.tags.includes("cinematic")
    )
  ) {
    score += 25;
  }

  // BRIDAL EMOTION BOOST

  if (
    occasion === "bridal" &&
    block.semanticRole === "emotion"
  ) {
    score += 35;
  }

  // TEXTURE PRIORITY BOOST

  if (
    occasion === "bridal" &&
    block.semanticRole === "texture"
  ) {
    score += 40;
  }

  // RUNWAY MOTION BOOST

  if (
    campaign === "runway" &&
    block.semanticRole === "pose"
  ) {
    score += 30;
  }

  // ULTRA LUXURY BOOST

  if (
    luxuryTier === "ultra-luxury"
  ) {
    score +=
      block.cinematicDominance * 0.25;
  }

  // EDITORIAL MINIMAL SUPPRESSION

  if (
    mood === "minimal" &&
    block.semanticRole === "emotion"
  ) {
    score -= 25;
  }

  return score;
}

export function resolveDynamicBlocks(
  context: PromptContext,
  activatedBlockIds: string[]
): ActivatedBlock[] {
  return PROMPT_BLOCKS
    .filter(
      (block) =>
        activatedBlockIds.includes(block.id)
    )
    .map((block) => {
      const activationScore =
        block.orchestrationPriority +
        block.cinematicDominance +
        calculateContextBonus(
          context,
          block
        );

      return {
        block,

        activationScore,
      };
    })
    .sort(
      (a, b) =>
        b.activationScore -
        a.activationScore
    );
}