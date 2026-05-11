import {
  EditorialPromptPayload,
} from '../types/editorial.types'

import {
  EditorialVariationSet,
} from '../antiRepetition/variationEngine'

import {
  buildNegativeSuppression,
} from './negativeSuppression'

import {
  buildGarmentPriority,
} from './garmentPriority'

import {
  buildEditorialIdentityReinforcement,
} from './editorialIdentityReinforcement'

import {
  getWorldEditorialSignature,
} from '../worlds/worldEditorialSignature'

export interface CompressEditorialPromptInput {
  payload: EditorialPromptPayload

  variations: EditorialVariationSet
}

function compact(values: string[]): string {
  return values
    .filter(Boolean)
    .join(', ')
}

export function compressEditorialPrompt({
  payload,
  variations,
}: CompressEditorialPromptInput): string {
  const {
    world,
    cinematography,
    shot,
    shotVariation,
  } = payload

  const negativeSuppression =
    buildNegativeSuppression()

  const garmentPriority =
    buildGarmentPriority()

  const editorialIdentity = compact([
    buildEditorialIdentityReinforcement(),

    getWorldEditorialSignature(
      world.id as any
    ),
  ])

  return compact([
    // WORLD
    world.atmosphere,
    world.architecture,
    world.lightingMood,
    world.colorPalette,
    world.environmentBehavior,

    // FRAME ARCHITECTURE
    cinematography.frameArchitecture.framing,
    cinematography.frameArchitecture.composition,
    cinematography.frameArchitecture.cameraDistance,
    cinematography.frameArchitecture.cropBehavior,
    cinematography.frameArchitecture.silhouettePriority,

    // LENS COMPRESSION
    cinematography.lensCompression.focalBehavior,
    cinematography.lensCompression.depthBehavior,
    cinematography.lensCompression.perspectiveControl,
    cinematography.lensCompression.backgroundBehavior,

    // LIGHTING HIERARCHY
    cinematography.lightingHierarchy.primaryLight,
    cinematography.lightingHierarchy.garmentPriority,
    cinematography.lightingHierarchy.shadowDiscipline,
    cinematography.lightingHierarchy.skinRendering,
    cinematography.lightingHierarchy.contrastBehavior,

    // EMOTIONAL PERFORMANCE
    cinematography.emotionalPerformance.expression,
    cinematography.emotionalPerformance.gazeBehavior,
    cinematography.emotionalPerformance.bodyLanguage,
    cinematography.emotionalPerformance.movementEnergy,

    // ENVIRONMENTAL SUPPRESSION
    cinematography.environmentalSuppression
      .environmentPriority,

    cinematography.environmentalSuppression
      .architectureBehavior,

    cinematography.environmentalSuppression
      .clutterControl,

    cinematography.environmentalSuppression
      .depthDiscipline,

    // SHOT ARCHITECTURE
    shot.shotType,
    shot.poseDirection,
    shot.bodyBehavior,
    shot.garmentInteraction,
    shot.spatialBehavior,
    shot.cinematicEnergy,

    // SHOT VARIATION
    shotVariation.poseModulation,
    shotVariation.gazeModulation,
    shotVariation.garmentMotionModulation,
    shotVariation.framingModulation,
    shotVariation.emotionalModulation,

    // VARIATION ENGINE
    variations.cameraDistance,
    variations.gazeDirection,
    variations.poseEnergy,
    variations.lightingGeometry,
    variations.architectureDensity,

    // GLOBAL RULES
    'portrait 4:5 luxury editorial campaign framing',

    'subject dominance priority',

    'environment supports garment hierarchy',

    'cinematic realism with restrained luxury discipline',

    // EDITORIAL IDENTITY
    `editorial identity reinforcement: ${editorialIdentity}`,

    // GARMENT PRIORITY
    `garment priority reinforcement: ${garmentPriority}`,

    // NEGATIVE SUPPRESSION
    `negative space suppression: ${negativeSuppression}`,
  ])
}