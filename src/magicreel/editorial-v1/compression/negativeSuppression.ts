export const luxuryNegativeSuppression = [
  // AI LOOK
  'cheap ai aesthetic',
  'synthetic beauty filter look',
  'plastic skin texture',
  'overprocessed facial rendering',
  'hyper-real glossy skin',
  'uncanny facial symmetry',

  // COMPOSITION CHAOS
  'cluttered composition',
  'busy background',
  'overcrowded environment',
  'visual noise',
  'environment overpowering subject',

  // LIGHTING PROBLEMS
  'oversaturated lighting',
  'harsh flash appearance',
  'extreme hdr effect',
  'blown highlights',
  'flat lighting',
  'neon color contamination',

  // BODY / ANATOMY ISSUES
  'distorted anatomy',
  'warped limbs',
  'unnatural body proportions',
  'twisted hands',
  'broken fingers',
  'deformed posture',

  // FASHION QUALITY ISSUES
  'garment distortion',
  'fabric melting',
  'inconsistent textile texture',
  'poor embroidery definition',
  'fashion catalog stiffness',

  // INFLUENCER AESTHETICS
  'instagram influencer posing',
  'exaggerated expressions',
  'overly seductive pose',
  'performative social media energy',
  'commercial beauty ad styling',

  // ENVIRONMENTAL EXCESS
  'tourism photography aesthetic',
  'excessive scenery dominance',
  'overdecorated architecture',
  'cinematic clutter',

  // LOW-END AI BEHAVIOR
  'generic ai fashion image',
  'stock photo appearance',
  'template-like composition',
  'overdramatic cinematic effects',
]

export function buildNegativeSuppression(): string {
  return luxuryNegativeSuppression.join(', ')
}