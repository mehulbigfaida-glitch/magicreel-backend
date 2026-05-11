import {
  EditorialWorldId,
} from './worldRegistry'

export const worldEditorialSignatures: Record<
  EditorialWorldId,
  string
> = {
  'dark-aristocracy':
    'aristocratic emotional distance with sculptural cinematic restraint and shadow-dominant luxury composition',

  'garden-nostalgia':
    'romantic fading-memory atmosphere with poetic softness and emotionally delicate editorial silence',

  'celestial-silence':
    'minimalist contemplative luxury with atmospheric spatial openness and surreal cinematic calmness',

  // TEMPORARY PLACEHOLDERS

  'mediterranean-heirloom':
    'sunlit heritage luxury with elegant vacation editorial realism and timeless maison sophistication',

  'sculpted-riviera':
    'architectural coastal glamour with clean sculptural luxury framing and cinematic resort elegance',

  'alpine-nomad':
    'textural nomadic luxury with cinematic cold-weather restraint and natural atmospheric realism',

  'runway-silence':
    'high-fashion runway authority with emotionally detached couture stillness and monochromatic discipline',

  'chromatic-glamour':
    'bold editorial glamour with controlled chromatic richness and luxury beauty-campaign precision',

  'lago-eleganza':
    'romantic lakeside sophistication with graceful cinematic softness and timeless European elegance',
}

export function getWorldEditorialSignature(
  worldId: EditorialWorldId
): string {
  return worldEditorialSignatures[worldId]
}