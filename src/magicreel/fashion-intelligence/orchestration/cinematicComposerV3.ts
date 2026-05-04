import { FashionCategory } from "../types/fashion.types";

import {
  orchestrateLuxuryPrompt,
} from "./promptOrchestrator";

export interface CinematicPromptV3Result {
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
      return `A timeless luxury saree editorial portrait with graceful femininity and sophisticated cinematic elegance`;

    case "menswear":
      return `A heritage-inspired luxury menswear editorial portrait with refined masculine sophistication and cinematic authority`;

    case "westernwear":
      return `A modern luxury fashion editorial portrait with elevated contemporary styling and premium editorial sophistication`;

    case "bridal":
      return `A cinematic bridal couture campaign portrait with emotionally rich luxury storytelling and regal couture elegance`;

    default:
      return `A premium cinematic luxury fashion editorial portrait`;
  }
}

function section(
  title: string,
  fragments: string[]
): string {
  if (!fragments.length) {
    return "";
  }

  return `${title}: ${unique(fragments).join(", ")}`;
}

export function composeCinematicPromptV3(
  category: FashionCategory
): CinematicPromptV3Result {
  const orchestration =
    orchestrateLuxuryPrompt(category);

  const positive =
    orchestration.positivePromptFragments;

  const cameraFragments =
    positive.filter(
      (fragment) =>
        fragment.includes("camera") ||
        fragment.includes("framing") ||
        fragment.includes("composition")
    );

  const lightingFragments =
    positive.filter(
      (fragment) =>
        fragment.includes("lighting") ||
        fragment.includes("shadow") ||
        fragment.includes("contrast") ||
        fragment.includes("glow")
    );

  const textureFragments =
    positive.filter(
      (fragment) =>
        fragment.includes("textile") ||
        fragment.includes("fabric") ||
        fragment.includes("embroidery") ||
        fragment.includes("texture")
    );

  const poseFragments =
    positive.filter(
      (fragment) =>
        fragment.includes("posture") ||
        fragment.includes("movement") ||
        fragment.includes("body") ||
        fragment.includes("wrist")
    );

  const emotionFragments =
    positive.filter(
      (fragment) =>
        fragment.includes("emotion") ||
        fragment.includes("mood") ||
        fragment.includes("elegance") ||
        fragment.includes("storytelling")
    );

  const editorialFragments =
    orchestration.luxuryRules;

  const positivePromptSections = [
    buildSceneIntro(
      category,
      orchestration.cinematicTone
    ),

    section(
      "CAMERA LANGUAGE",
      cameraFragments
    ),

    section(
      "LIGHTING",
      lightingFragments
    ),

    section(
      "TEXTURE AND GARMENT FIDELITY",
      textureFragments
    ),

    section(
      "POSE AND MOVEMENT",
      poseFragments
    ),

    section(
      "EMOTIONAL TONE",
      emotionFragments
    ),

    section(
      "EDITORIAL LUXURY STANDARDS",
      editorialFragments
    ),
  ].filter(Boolean);

  const positivePrompt =
    positivePromptSections.join(". ");

  const negativePrompt =
    unique(
      orchestration.negativePromptFragments
    ).join(", ");

  return {
    category,

    cinematicTone:
      orchestration.cinematicTone,

    positivePrompt,

    negativePrompt,
  };
}