import { EmotionalPerformanceBlock } from '../types/editorial.types'

export const emotionalPerformancePresets = {
  restrainedLuxury: {
    expression:
      'emotionally restrained editorial calm with cinematic stillness',

    gazeBehavior:
      'soft distant gaze with understated emotional presence',

    bodyLanguage:
      'controlled luxury posture with minimal performative energy',

    movementEnergy:
      'subtle natural stillness with refined editorial composure',
  },

  aristocraticDistance: {
    expression:
      'psychologically distant expression with quiet emotional control',

    gazeBehavior:
      'detached cinematic gaze with aristocratic restraint',

    bodyLanguage:
      'structured posture with composed luxury confidence',

    movementEnergy:
      'minimal physical motion with controlled editorial tension',
  },

  romanticSilence: {
    expression:
      'soft introspective emotion with nostalgic editorial subtlety',

    gazeBehavior:
      'gentle unfocused gaze with cinematic contemplation',

    bodyLanguage:
      'relaxed graceful posture with emotional softness',

    movementEnergy:
      'light natural movement with poetic stillness',
  },
} satisfies Record<string, EmotionalPerformanceBlock>

export type EmotionalPerformancePreset =
  keyof typeof emotionalPerformancePresets

export function getEmotionalPerformance(
  preset: EmotionalPerformancePreset = 'restrainedLuxury'
): EmotionalPerformanceBlock {
  return emotionalPerformancePresets[preset]
}