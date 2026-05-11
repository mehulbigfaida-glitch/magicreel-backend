import { EnvironmentalSuppressionBlock } from '../types/editorial.types'

export const environmentalSuppressionPresets = {
  luxuryMinimalism: {
    environmentPriority:
      'environment remains subordinate to garment and subject hierarchy',

    architectureBehavior:
      'restrained supporting architecture with cinematic simplicity',

    clutterControl:
      'clean editorial environment with minimal visual noise',

    depthDiscipline:
      'controlled spatial layering preserving subject dominance',
  },

  cinematicIsolation: {
    environmentPriority:
      'subject isolation prioritized over environmental complexity',

    architectureBehavior:
      'soft atmospheric structures with reduced visual competition',

    clutterControl:
      'suppressed background detail with cinematic restraint',

    depthDiscipline:
      'deep environmental falloff preserving editorial focus',
  },

  editorialBalance: {
    environmentPriority:
      'balanced environmental support without overpowering garment visibility',

    architectureBehavior:
      'elegant minimal geometry supporting luxury framing',

    clutterControl:
      'refined environmental cleanliness with tonal harmony',

    depthDiscipline:
      'natural cinematic depth separation with visual stability',
  },
} satisfies Record<string, EnvironmentalSuppressionBlock>

export type EnvironmentalSuppressionPreset =
  keyof typeof environmentalSuppressionPresets

export function getEnvironmentalSuppression(
  preset: EnvironmentalSuppressionPreset = 'luxuryMinimalism'
): EnvironmentalSuppressionBlock {
  return environmentalSuppressionPresets[preset]
}