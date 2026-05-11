import { LightingHierarchyBlock } from '../types/editorial.types'

export const lightingHierarchyPresets = {
  sculptedLuxury: {
    primaryLight:
      'soft sculptural directional lighting with cinematic diffusion',

    garmentPriority:
      'fabric texture and garment detail illumination priority',

    shadowDiscipline:
      'controlled cinematic shadow retention with depth preservation',

    skinRendering:
      'natural editorial skin diffusion with restrained highlights',

    contrastBehavior:
      'restrained luxury contrast with balanced tonal separation',
  },

  darkEditorial: {
    primaryLight:
      'low-key directional lighting with sculpted facial contouring',

    garmentPriority:
      'luxury textile visibility through controlled highlight placement',

    shadowDiscipline:
      'deep cinematic shadow discipline with preserved subject readability',

    skinRendering:
      'soft analog-inspired skin rendering with muted specular response',

    contrastBehavior:
      'moody editorial contrast with restrained dynamic range',
  },

  softDaylight: {
    primaryLight:
      'soft natural daylight diffusion with elegant tonal falloff',

    garmentPriority:
      'balanced garment illumination with texture clarity preservation',

    shadowDiscipline:
      'subtle natural shadow gradients with cinematic softness',

    skinRendering:
      'clean editorial skin tones with airy luxury rendering',

    contrastBehavior:
      'gentle premium contrast with soft tonal transitions',
  },
} satisfies Record<string, LightingHierarchyBlock>

export type LightingHierarchyPreset =
  keyof typeof lightingHierarchyPresets

export function getLightingHierarchy(
  preset: LightingHierarchyPreset = 'sculptedLuxury'
): LightingHierarchyBlock {
  return lightingHierarchyPresets[preset]
}