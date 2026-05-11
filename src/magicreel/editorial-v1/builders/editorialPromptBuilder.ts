import {
  getShotVariation,
} from '../shots/shotVariationEngine'

import {
  getWorldShotDefault,
} from '../worlds/worldShotDefaults'

import {
  EditorialCinematography,
  EditorialPromptPayload,
} from '../types/editorial.types'

import {
  getFrameArchitecture,
  FrameArchitecturePreset,
} from '../cinematography/frameArchitecture'

import {
  getLensCompression,
  LensCompressionPreset,
} from '../cinematography/lensCompression'

import {
  getLightingHierarchy,
  LightingHierarchyPreset,
} from '../cinematography/lightingHierarchy'

import {
  getEmotionalPerformance,
  EmotionalPerformancePreset,
} from '../cinematography/emotionalPerformance'

import {
  getEnvironmentalSuppression,
  EnvironmentalSuppressionPreset,
} from '../cinematography/environmentalSuppression'

import {
  generateEditorialVariations,
} from '../antiRepetition/variationEngine'

import {
  compressEditorialPrompt,
} from '../compression/editorialCompressor'

import {
  getEditorialWorld,
  EditorialWorldId,
} from '../worlds/worldRegistry'

import {
  getWorldCinematicDefaults,
  WorldCinematicDefaults,
} from '../worlds/worldCinematicDefaults'

import {
  getShotArchitecture,
  ShotArchitectureId,
} from '../shots/shotArchitecture'

export interface BuildEditorialPromptInput {
  worldId?: EditorialWorldId

  framePreset?: FrameArchitecturePreset

  lensPreset?: LensCompressionPreset

  lightingPreset?: LightingHierarchyPreset

  emotionPreset?: EmotionalPerformancePreset

  suppressionPreset?: EnvironmentalSuppressionPreset

  shotId?: ShotArchitectureId

  variationSeed?: number
}

function buildCinematography(
  input: BuildEditorialPromptInput,
  defaults: WorldCinematicDefaults
): EditorialCinematography {
  return {
    frameArchitecture: getFrameArchitecture(
      input.framePreset ?? defaults.framePreset
    ),

    lensCompression: getLensCompression(
      input.lensPreset ?? defaults.lensPreset
    ),

    lightingHierarchy: getLightingHierarchy(
      input.lightingPreset ?? defaults.lightingPreset
    ),

    emotionalPerformance: getEmotionalPerformance(
      input.emotionPreset ?? defaults.emotionPreset
    ),

    environmentalSuppression:
      getEnvironmentalSuppression(
        input.suppressionPreset ??
          defaults.suppressionPreset
      ),
  }
}

export function buildEditorialPrompt(
  input: BuildEditorialPromptInput = {}
): string {
  const worldId =
    input.worldId ?? 'dark-aristocracy'

  const world =
    getEditorialWorld(worldId)

  const defaults =
    getWorldCinematicDefaults(worldId)

  const cinematography =
    buildCinematography(
      input,
      defaults
    )

  const shot =
  getShotArchitecture(
    input.shotId ??
      getWorldShotDefault(worldId)
  )

const shotVariation =
  getShotVariation(
    input.shotId ??
      getWorldShotDefault(worldId),

    input.variationSeed ?? Date.now()
  )

  const payload: EditorialPromptPayload = {
  world,
  cinematography,
  shot,
  shotVariation,
}

  const variations =
    generateEditorialVariations(
      input.variationSeed ?? Date.now()
    )

  return compressEditorialPrompt({
    payload,
    variations,
  })
}