import { ShotArchitecture } from '../shots/shotArchitecture'

import { ShotVariation } from '../shots/shotVariationEngine'

export interface EditorialWorld {
  id: string
  name: string
  atmosphere: string
  architecture: string
  lightingMood: string
  colorPalette: string
  environmentBehavior: string
}

export interface FrameArchitectureBlock {
  framing: string
  composition: string
  cameraDistance: string
  cropBehavior: string
  silhouettePriority: string
}

export interface LensCompressionBlock {
  focalBehavior: string
  depthBehavior: string
  perspectiveControl: string
  backgroundBehavior: string
}

export interface LightingHierarchyBlock {
  primaryLight: string
  garmentPriority: string
  shadowDiscipline: string
  skinRendering: string
  contrastBehavior: string
}

export interface EmotionalPerformanceBlock {
  expression: string
  gazeBehavior: string
  bodyLanguage: string
  movementEnergy: string
}

export interface EnvironmentalSuppressionBlock {
  environmentPriority: string
  architectureBehavior: string
  clutterControl: string
  depthDiscipline: string
}

export interface EditorialCinematography {
  frameArchitecture: FrameArchitectureBlock

  lensCompression: LensCompressionBlock

  lightingHierarchy: LightingHierarchyBlock

  emotionalPerformance: EmotionalPerformanceBlock

  environmentalSuppression: EnvironmentalSuppressionBlock
}

export interface EditorialPromptPayload {
  world: EditorialWorld

  cinematography: EditorialCinematography

  shot: ShotArchitecture

  shotVariation: ShotVariation
}