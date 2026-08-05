import { EditorialWorld } from "../../types/editorial.types";

import { alpineNomad } from "./alpineNomad";
import { celestialSilence } from "./celestialSilence";
import { chromaticGlamour } from "./chromaticGlamour";
import { darkAristocracy } from "./darkAristocracy";
import { gardenNostalgia } from "./gardenNostalgia";
import { lagoEleganza } from "./lagoEleganza";
import { mediterraneanHeirloom } from "./mediterraneanHeirloom";
import { runwaySilence } from "./runwaySilence";
import { sculptedRiviera } from "./sculptedRiviera";

/**
 * MagicReel Editorial Worlds Registry
 *
 * The Prompt Builder should never import individual worlds.
 * It should always resolve worlds through this registry.
 */

export const editorialWorlds: Record<string, EditorialWorld> = {

  "garden-nostalgia": gardenNostalgia,

  "dark-aristocracy": darkAristocracy,

  "celestial-silence": celestialSilence,

  "lago-eleganza": lagoEleganza,

  "mediterranean-heirloom": mediterraneanHeirloom,

  "sculpted-riviera": sculptedRiviera,

  "chromatic-glamour": chromaticGlamour,

  "alpine-nomad": alpineNomad,

  "runway-silence": runwaySilence

};

/**
 * Ordered collection of all Editorial Worlds.
 * Useful for UI selectors, galleries, previews and future APIs.
 */
export const editorialWorldList: EditorialWorld[] = [

  gardenNostalgia,

  darkAristocracy,

  celestialSilence,

  lagoEleganza,

  mediterraneanHeirloom,

  sculptedRiviera,

  chromaticGlamour,

  alpineNomad,

  runwaySilence

];

/**
 * Convenience helper.
 */
export function getEditorialWorld(id: string): EditorialWorld {

  const world = editorialWorlds[id];

  if (!world) {

    throw new Error(`Unknown editorial world: ${id}`);

  }

  return world;

}