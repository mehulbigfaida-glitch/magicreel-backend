import { EditorialWorld } from '../types/editorial.types'

import { darkAristocracyWorld } from './darkAristocracy'
import { gardenNostalgiaWorld } from './gardenNostalgia'
import { celestialSilenceWorld } from './celestialSilence'

export type EditorialWorldId =
  | 'dark-aristocracy'
  | 'garden-nostalgia'
  | 'celestial-silence'
  | 'mediterranean-heirloom'
  | 'sculpted-riviera'
  | 'alpine-nomad'
  | 'runway-silence'
  | 'chromatic-glamour'
  | 'lago-eleganza'

export const editorialWorldRegistry: Record<
  EditorialWorldId,
  EditorialWorld
> = {
  'dark-aristocracy': darkAristocracyWorld,

  'garden-nostalgia': gardenNostalgiaWorld,

  'celestial-silence': celestialSilenceWorld,

  // PLACEHOLDERS FOR UPCOMING WORLDS

  'mediterranean-heirloom': darkAristocracyWorld,

  'sculpted-riviera': darkAristocracyWorld,

  'alpine-nomad': darkAristocracyWorld,

  'runway-silence': darkAristocracyWorld,

  'chromatic-glamour': darkAristocracyWorld,

  'lago-eleganza': darkAristocracyWorld,
}

export function getEditorialWorld(
  worldId: EditorialWorldId
): EditorialWorld {
  return editorialWorldRegistry[worldId]
}