import { PromptContext } from "../types/context.types";

export interface ResolvedContextProfile {
  cinematicIntensity: number;

  emotionalIntensity: number;

  editorialStrength: number;

  heritageStrength: number;

  luxuryAmplification: number;

  motionIntensity: number;

  lightingStyle: string;

  compositionStyle: string;
}

export function resolveContextProfile(
  context: PromptContext
): ResolvedContextProfile {
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

  let cinematicIntensity = 75;

  let emotionalIntensity = 60;

  let editorialStrength = 70;

  let heritageStrength = 50;

  let luxuryAmplification = 70;

  let motionIntensity = 40;

  let lightingStyle =
    "cinematic luxury lighting";

  let compositionStyle =
    "editorial luxury composition";

  if (mood === "royal") {
    heritageStrength += 30;

    luxuryAmplification += 25;

    lightingStyle =
      "museum-grade royal lighting";
  }

  if (campaign === "bridal-campaign") {
    emotionalIntensity += 30;

    cinematicIntensity += 20;

    luxuryAmplification += 20;
  }

  if (campaign === "runway") {
    motionIntensity += 40;

    editorialStrength += 20;
  }

  if (luxuryTier === "ultra-luxury") {
    luxuryAmplification += 35;

    cinematicIntensity += 15;
  }

  if (occasion === "bridal") {
    emotionalIntensity += 25;

    heritageStrength += 20;
  }

  return {
    cinematicIntensity,

    emotionalIntensity,

    editorialStrength,

    heritageStrength,

    luxuryAmplification,

    motionIntensity,

    lightingStyle,

    compositionStyle,
  };
}