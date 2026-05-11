import {
  buildEditorialWorld,
  CinematicWorldId,
} from "./cinematicWorld.registry";

import { buildCinematicPrompt } from "./cinematicPrompt.builder";

import {
  generateCinematicImage,
  GenerateCinematicImageResult,
} from "./generateCinematicImage";

/* ------------------------------------------------------- */

export interface GenerateCinematicPackInput {
  heroImageUrl: string;

  logoUrl?: string;

  worldId: CinematicWorldId;

  brandName?: string;

  seed?: number;
}

export interface GenerateCinematicPackResult {
  success: boolean;

  worldId: CinematicWorldId;

  worldSignature: string;

  prompt: string;

  generation: GenerateCinematicImageResult;
}

/* ------------------------------------------------------- */

export async function generateCinematicPack({
  heroImageUrl,
  logoUrl,
  worldId,
  brandName,
  seed,
}: GenerateCinematicPackInput): Promise<GenerateCinematicPackResult> {
  /*
    ----------------------------------------------------
    STEP 1 — BUILD EDITORIAL WORLD
    ----------------------------------------------------
  */

  const editorialWorld = buildEditorialWorld(
    worldId,
    seed ?? Date.now()
  );

  /*
    ----------------------------------------------------
    STEP 2 — BUILD LUXURY PROMPT
    ----------------------------------------------------
  */

  const prompt = buildCinematicPrompt({
    world: editorialWorld,
    brandName,
  });

  /*
    ----------------------------------------------------
    STEP 3 — EXECUTE IMAGE GENERATION
    ----------------------------------------------------
  */

  const generation = await generateCinematicImage({
    prompt,
    heroImageUrl,
    logoUrl,
    seed,
  });

  /*
    ----------------------------------------------------
    STEP 4 — RETURN FINAL RESULT
    ----------------------------------------------------
  */

  return {
    success: true,

    worldId,

    worldSignature: editorialWorld.worldSignature,

    prompt,

    generation,
  };
}