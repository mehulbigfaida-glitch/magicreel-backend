import { FrameArchitectureBlock } from '../types/editorial.types'

export const frameArchitecturePresets = {
  luxuryPortrait: {
    framing:
      'waist-up editorial dominance with restrained negative space',

    composition:
      'subject-centered cinematic editorial hierarchy',

    cameraDistance:
      'mid portrait compression with balanced garment visibility',

    cropBehavior:
      'clean garment-preserving portrait crop',

    silhouettePriority:
      'clear silhouette readability with luxury campaign balance',
  },

  coutureEditorial: {
    framing:
      'full-body editorial framing with elongated silhouette emphasis',

    composition:
      'high-fashion composition with controlled spatial discipline',

    cameraDistance:
      'full-length cinematic framing with restrained environmental presence',

    cropBehavior:
      'editorial crop preserving garment structure and movement',

    silhouettePriority:
      'runway-grade silhouette separation and readability',
  },

  cinematicCloseup: {
    framing:
      'tight cinematic portrait framing with emotional restraint',

    composition:
      'facial and garment texture priority hierarchy',

    cameraDistance:
      'close-range portrait compression with soft spatial falloff',

    cropBehavior:
      'editorial close crop preserving luxury visual balance',

    silhouettePriority:
      'facial and upper garment dominance with clean separation',
  },
} satisfies Record<string, FrameArchitectureBlock>

export type FrameArchitecturePreset =
  keyof typeof frameArchitecturePresets

export function getFrameArchitecture(
  preset: FrameArchitecturePreset = 'luxuryPortrait'
): FrameArchitectureBlock {
  return frameArchitecturePresets[preset]
}