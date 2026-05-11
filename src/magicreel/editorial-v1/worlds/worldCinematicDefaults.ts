import {
  FrameArchitecturePreset,
} from '../cinematography/frameArchitecture'

import {
  LensCompressionPreset,
} from '../cinematography/lensCompression'

import {
  LightingHierarchyPreset,
} from '../cinematography/lightingHierarchy'

import {
  EmotionalPerformancePreset,
} from '../cinematography/emotionalPerformance'

import {
  EnvironmentalSuppressionPreset,
} from '../cinematography/environmentalSuppression'

import { EditorialWorldId } from './worldRegistry'

export interface WorldCinematicDefaults {
  framePreset: FrameArchitecturePreset

  lensPreset: LensCompressionPreset

  lightingPreset: LightingHierarchyPreset

  emotionPreset: EmotionalPerformancePreset

  suppressionPreset: EnvironmentalSuppressionPreset
}

export const worldCinematicDefaults: Record<
  EditorialWorldId,
  WorldCinematicDefaults
> = {
  'dark-aristocracy': {
    framePreset: 'coutureEditorial',
    lensPreset: 'cinematic85mm',
    lightingPreset: 'darkEditorial',
    emotionPreset: 'aristocraticDistance',
    suppressionPreset: 'cinematicIsolation',
  },

  'garden-nostalgia': {
    framePreset: 'luxuryPortrait',
    lensPreset: 'intimatePortrait',
    lightingPreset: 'softDaylight',
    emotionPreset: 'romanticSilence',
    suppressionPreset: 'editorialBalance',
  },

  'celestial-silence': {
    framePreset: 'cinematicCloseup',
    lensPreset: 'cinematic85mm',
    lightingPreset: 'sculptedLuxury',
    emotionPreset: 'restrainedLuxury',
    suppressionPreset: 'luxuryMinimalism',
  },

  // TEMPORARY PLACEHOLDERS

  'mediterranean-heirloom': {
    framePreset: 'coutureEditorial',
    lensPreset: 'runwayCompression',
    lightingPreset: 'softDaylight',
    emotionPreset: 'restrainedLuxury',
    suppressionPreset: 'editorialBalance',
  },

  'sculpted-riviera': {
    framePreset: 'luxuryPortrait',
    lensPreset: 'cinematic85mm',
    lightingPreset: 'sculptedLuxury',
    emotionPreset: 'restrainedLuxury',
    suppressionPreset: 'luxuryMinimalism',
  },

  'alpine-nomad': {
    framePreset: 'coutureEditorial',
    lensPreset: 'runwayCompression',
    lightingPreset: 'softDaylight',
    emotionPreset: 'romanticSilence',
    suppressionPreset: 'cinematicIsolation',
  },

  'runway-silence': {
    framePreset: 'coutureEditorial',
    lensPreset: 'runwayCompression',
    lightingPreset: 'darkEditorial',
    emotionPreset: 'aristocraticDistance',
    suppressionPreset: 'luxuryMinimalism',
  },

  'chromatic-glamour': {
    framePreset: 'cinematicCloseup',
    lensPreset: 'intimatePortrait',
    lightingPreset: 'sculptedLuxury',
    emotionPreset: 'restrainedLuxury',
    suppressionPreset: 'editorialBalance',
  },

  'lago-eleganza': {
    framePreset: 'luxuryPortrait',
    lensPreset: 'cinematic85mm',
    lightingPreset: 'softDaylight',
    emotionPreset: 'romanticSilence',
    suppressionPreset: 'luxuryMinimalism',
  },
}

export function getWorldCinematicDefaults(
  worldId: EditorialWorldId
): WorldCinematicDefaults {
  return worldCinematicDefaults[worldId]
}