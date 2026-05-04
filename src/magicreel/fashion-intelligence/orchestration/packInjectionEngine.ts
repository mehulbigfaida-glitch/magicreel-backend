import {
  PromptContext,
} from "../types/context.types";

import { PromptBlock } from "../blocks/promptBlockEngine";

import {
  HERITAGE_ARCHITECTURE_PACK,
} from "../packs/heritageArchitecturePack";

import {
  RUNWAY_MOTION_PACK,
} from "../packs/runwayMotionPack";

import {
  EDITORIAL_MINIMAL_PACK,
} from "../packs/editorialMinimalPack";

import {
  BRIDAL_JEWELRY_PACK,
} from "../packs/bridalJewelryPack";

import {
  CINEMATIC_SHADOW_PACK,
} from "../packs/cinematicShadowPack";

export function resolveInjectedPacks(
  context: PromptContext
): PromptBlock[] {
  const resolved: PromptBlock[] = [];

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

  // HERITAGE / ROYAL

  if (
    mood === "royal" ||
    mood === "heritage"
  ) {
    resolved.push(
      ...HERITAGE_ARCHITECTURE_PACK
    );
  }

  // BRIDAL JEWELRY

  if (
    occasion === "bridal"
  ) {
    resolved.push(
      ...BRIDAL_JEWELRY_PACK
    );
  }

  // RUNWAY ENERGY

  if (
    campaign === "runway"
  ) {
    resolved.push(
      ...RUNWAY_MOTION_PACK
    );
  }

  // MINIMAL EDITORIAL

  if (
    mood === "minimal"
  ) {
    resolved.push(
      ...EDITORIAL_MINIMAL_PACK
    );
  }

  // ULTRA LUXURY SHADOW DEPTH

  if (
    luxuryTier === "ultra-luxury"
  ) {
    resolved.push(
      ...CINEMATIC_SHADOW_PACK
    );
  }

  return resolved;
}