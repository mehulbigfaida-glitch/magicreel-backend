import {
  ShotArchitectureId,
} from '../shots/shotArchitecture'

import {
  EditorialWorldId,
} from './worldRegistry'

export const worldShotDefaults: Record<
  EditorialWorldId,
  ShotArchitectureId
> = {
  'dark-aristocracy':
    'architecturalLean',

  'garden-nostalgia':
    'reflectivePortrait',

  'celestial-silence':
    'closeupTexture',

  // TEMPORARY PLACEHOLDERS

  'mediterranean-heirloom':
    'walkingCouture',

  'sculpted-riviera':
    'runwayPause',

  'alpine-nomad':
    'walkingCouture',

  'runway-silence':
    'runwayPause',

  'chromatic-glamour':
    'closeupTexture',

  'lago-eleganza':
    'seatedEditorial',
}

export function getWorldShotDefault(
  worldId: EditorialWorldId
): ShotArchitectureId {
  return worldShotDefaults[worldId]
}