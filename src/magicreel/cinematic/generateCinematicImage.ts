import crypto from "crypto";

import {
  generateGeminiCampaignImage,
} from "../services/geminiImage.service";

/* ------------------------------------------------------- */

export interface GenerateCinematicImageInput {
  prompt: string;

  heroImageUrl: string;

  logoUrl?: string;

  seed?: number;
}

export interface GenerateCinematicImageResult {
  success: boolean;

  imageUrl: string;

  generationId: string;

  provider: string;

  prompt: string;

  seed: number;
}

/* ------------------------------------------------------- */

function generateSeed(seed?: number) {
  if (typeof seed === "number") {
    return seed;
  }

  return Math.floor(Math.random() * 1000000);
}

/* ------------------------------------------------------- */

export async function generateCinematicImage({
  prompt,
  heroImageUrl,
  logoUrl,
  seed,
}: GenerateCinematicImageInput): Promise<GenerateCinematicImageResult> {
  const finalSeed = generateSeed(seed);

  const generationId = crypto.randomUUID();

  /*
    ----------------------------------------------------
    GEMINI GENERATION
    ----------------------------------------------------
  */

  const imageUrl =
    await generateGeminiCampaignImage({
      heroImageUrl,

      logoImageUrl: logoUrl,

      prompt,
    });

  return {
    success: true,

    imageUrl,

    generationId,

    provider: "gemini-2.5-flash-image",

    prompt,

    seed: finalSeed,
  };
}