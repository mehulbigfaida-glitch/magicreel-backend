export interface ShotArchitecture {
  shotType: string

  poseDirection: string

  bodyBehavior: string

  garmentInteraction: string

  spatialBehavior: string

  cinematicEnergy: string
}

export const shotArchitectureRegistry = {
  runwayPause: {
    shotType:
      'high-fashion runway pause moment',

    poseDirection:
      'sculptural upright pose with restrained motion',

    bodyBehavior:
      'controlled couture posture with subtle asymmetry',

    garmentInteraction:
      'garment drape emphasized through stillness and silhouette clarity',

    spatialBehavior:
      'clean editorial spatial separation with runway-like discipline',

    cinematicEnergy:
      'quiet luxury tension with composed fashion authority',
  },

  seatedEditorial: {
    shotType:
      'luxury seated editorial composition',

    poseDirection:
      'relaxed seated posture with elegant limb positioning',

    bodyBehavior:
      'soft editorial stillness with controlled body geometry',

    garmentInteraction:
      'fabric folds and textile structure naturally emphasized',

    spatialBehavior:
      'architectural framing supporting seated silhouette composition',

    cinematicEnergy:
      'emotionally restrained cinematic intimacy',
  },

  architecturalLean: {
    shotType:
      'architectural interaction fashion composition',

    poseDirection:
      'subtle leaning posture integrated with surrounding geometry',

    bodyBehavior:
      'elongated editorial body lines with sculptural balance',

    garmentInteraction:
      'garment silhouette contrasted against architectural structure',

    spatialBehavior:
      'strong environmental geometry with restrained visual competition',

    cinematicEnergy:
      'minimalist luxury stillness with spatial elegance',
  },

  walkingCouture: {
    shotType:
      'controlled couture walking sequence',

    poseDirection:
      'slow editorial walking posture with garment-led movement',

    bodyBehavior:
      'natural runway-inspired motion with restrained energy',

    garmentInteraction:
      'fabric movement and silhouette flow emphasized through motion',

    spatialBehavior:
      'cinematic forward depth with luxury movement rhythm',

    cinematicEnergy:
      'quiet cinematic motion with couture sophistication',
  },

  reflectivePortrait: {
    shotType:
      'emotionally reflective portrait composition',

    poseDirection:
      'still portrait posture with introspective orientation',

    bodyBehavior:
      'minimal movement with emotional restraint',

    garmentInteraction:
      'upper garment texture and silhouette subtly prioritized',

    spatialBehavior:
      'soft atmospheric depth with emotional spatial silence',

    cinematicEnergy:
      'poetic cinematic contemplation with luxury calmness',
  },

  closeupTexture: {
    shotType:
      'tight editorial textile-focused portrait',

    poseDirection:
      'controlled close-range pose with restrained facial movement',

    bodyBehavior:
      'minimal physical motion preserving texture clarity',

    garmentInteraction:
      'embroidery, fabric texture, and couture detailing prioritized',

    spatialBehavior:
      'shallow cinematic depth with compressed editorial framing',

    cinematicEnergy:
      'intimate luxury realism with refined stillness',
  },
} satisfies Record<string, ShotArchitecture>

export type ShotArchitectureId =
  keyof typeof shotArchitectureRegistry

export function getShotArchitecture(
  shotId: ShotArchitectureId
): ShotArchitecture {
  return shotArchitectureRegistry[shotId]
}