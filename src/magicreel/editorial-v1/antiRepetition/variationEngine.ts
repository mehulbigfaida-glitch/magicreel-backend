export const cameraDistancePool = [
  'mid portrait compression',
  'full-length editorial framing',
  'close cinematic portrait framing',
  'waist-up luxury composition',
  'elongated runway perspective',
]

export const gazeDirectionPool = [
  'soft distant gaze',
  'detached side profile attention',
  'subtle downward contemplation',
  'direct restrained editorial eye contact',
  'unfocused cinematic introspection',
]

export const poseEnergyPool = [
  'minimal movement with editorial restraint',
  'quiet luxury stillness',
  'subtle garment-driven motion',
  'controlled posture with sculptural balance',
  'natural relaxed composure',
]

export const lightingGeometryPool = [
  'soft directional side lighting',
  'sculptural frontal diffusion',
  'low-key cinematic shadow shaping',
  'natural window-light falloff',
  'overcast luxury tonal softness',
]

export const architectureDensityPool = [
  'minimal architectural interference',
  'restrained environmental geometry',
  'soft atmospheric structural layering',
  'clean luxury spatial separation',
  'subdued cinematic depth structures',
]

function rotateFromPool(
  pool: string[],
  seed: number
): string {
  return pool[seed % pool.length]
}

export interface EditorialVariationSet {
  cameraDistance: string
  gazeDirection: string
  poseEnergy: string
  lightingGeometry: string
  architectureDensity: string
}

export function generateEditorialVariations(
  seed: number
): EditorialVariationSet {
  return {
    cameraDistance: rotateFromPool(
      cameraDistancePool,
      seed
    ),

    gazeDirection: rotateFromPool(
      gazeDirectionPool,
      seed + 1
    ),

    poseEnergy: rotateFromPool(
      poseEnergyPool,
      seed + 2
    ),

    lightingGeometry: rotateFromPool(
      lightingGeometryPool,
      seed + 3
    ),

    architectureDensity: rotateFromPool(
      architectureDensityPool,
      seed + 4
    ),
  }
}