import crypto from "crypto";

import {
  falImageProvider,
} from "../services/image-generation/providers/fal.provider";

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

  const result =
    await falImageProvider.generateEditedImages({
      prompt,

      referenceImages: [
        heroImageUrl,

        ...(logoUrl ? [logoUrl] : []),
      ],

      numImages: 1,

      outputFormat: "png",

      quality: "medium",
    });

  const image = result.images[0];

  if (!image) {
    throw new Error("Fal returned no generated images.");
  }

  return {
    success: true,

    imageUrl: image.url,

    generationId,

    provider: "openai/gpt-image-2",

    prompt,

    seed: finalSeed,
  };
}