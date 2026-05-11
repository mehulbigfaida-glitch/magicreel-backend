export const editorialIdentitySignals = [
  // LUXURY EDITORIAL AUTHORITY
  'luxury fashion campaign visual authority',
  'high-fashion magazine editorial discipline',
  'premium couture photography realism',
  'emotionally restrained luxury storytelling',

  // PHOTOGRAPHIC SOPHISTICATION
  'intentional cinematic composition control',
  'minimalist luxury visual hierarchy',
  'refined photographic restraint',
  'quiet luxury atmosphere with premium editorial balance',

  // FASHION INDUSTRY LANGUAGE
  'vogue-grade editorial sophistication',
  'luxury maison campaign energy',
  'premium fashion house visual language',
  'couture-level garment presentation discipline',

  // ANTI-COMMERCIAL GOVERNANCE
  'avoid ecommerce catalog appearance',
  'avoid fast-fashion commercial styling',
  'avoid social media influencer energy',
  'avoid mass-market advertising aesthetics',

  // CINEMATIC REALISM
  'natural luxury realism with analog-inspired rendering',
  'cinematic subtlety over dramatic spectacle',
  'editorial stillness over performative posing',
  'premium visual silence with restrained emotional energy',

  // HIGH-END FASHION DIRECTION
  'subject photographed like a luxury campaign protagonist',
  'garment treated as couture centerpiece',
  'editorial photography over commercial product photography',
  'high-end fashion art direction consistency',
]

export function buildEditorialIdentityReinforcement(): string {
  return editorialIdentitySignals.join(', ')
}