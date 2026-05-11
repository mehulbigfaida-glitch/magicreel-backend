import { LensCompressionBlock } from '../types/editorial.types'

export const lensCompressionPresets = {
  cinematic85mm: {
    focalBehavior:
      '85mm medium compression with luxury editorial depth balance',

    depthBehavior:
      'soft cinematic depth falloff with controlled separation',

    perspectiveControl:
      'minimal wide-angle distortion with natural body proportions',

    backgroundBehavior:
      'compressed environmental layering with restrained visual competition',
  },

  runwayCompression: {
    focalBehavior:
      'telephoto-inspired runway compression with elongated silhouette rendering',

    depthBehavior:
      'deep subject isolation with soft editorial spatial diffusion',

    perspectiveControl:
      'stable high-fashion perspective discipline',

    backgroundBehavior:
      'subdued environmental compression preserving garment dominance',
  },

  intimatePortrait: {
    focalBehavior:
      'close portrait compression with natural facial geometry retention',

    depthBehavior:
      'shallow cinematic focus transition with emotional softness',

    perspectiveControl:
      'clean portrait perspective with restrained spatial exaggeration',

    backgroundBehavior:
      'minimal background interference with atmospheric softness',
  },
} satisfies Record<string, LensCompressionBlock>

export type LensCompressionPreset =
  keyof typeof lensCompressionPresets

export function getLensCompression(
  preset: LensCompressionPreset = 'cinematic85mm'
): LensCompressionBlock {
  return lensCompressionPresets[preset]
}