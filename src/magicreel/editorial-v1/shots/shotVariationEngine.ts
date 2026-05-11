import {
  ShotArchitectureId,
} from './shotArchitecture'

export interface ShotVariation {
  poseModulation: string

  gazeModulation: string

  garmentMotionModulation: string

  framingModulation: string

  emotionalModulation: string
}

const shotVariationRegistry: Record<
  ShotArchitectureId,
  ShotVariation[]
> = {
  runwayPause: [
    {
      poseModulation:
        'subtle asymmetrical runway posture',

      gazeModulation:
        'detached forward editorial gaze',

      garmentMotionModulation:
        'minimal garment movement with sculptural stillness',

      framingModulation:
        'elongated vertical framing emphasis',

      emotionalModulation:
        'quiet couture authority',
    },

    {
      poseModulation:
        'slight shoulder tension with poised stillness',

      gazeModulation:
        'soft distant runway focus',

      garmentMotionModulation:
        'controlled textile fall and silhouette separation',

      framingModulation:
        'balanced editorial runway geometry',

      emotionalModulation:
        'emotionally restrained luxury confidence',
    },
  ],

  seatedEditorial: [
    {
      poseModulation:
        'elegant seated asymmetry with relaxed couture posture',

      gazeModulation:
        'introspective downward visual attention',

      garmentMotionModulation:
        'fabric pooling naturally around seated silhouette',

      framingModulation:
        'architectural seated composition balance',

      emotionalModulation:
        'soft cinematic intimacy',
    },

    {
      poseModulation:
        'refined upright seated posture with sculptural limbs',

      gazeModulation:
        'calm side-profile contemplation',

      garmentMotionModulation:
        'structured textile fold emphasis',

      framingModulation:
        'luxury portrait-centered seated framing',

      emotionalModulation:
        'poetic editorial restraint',
    },
  ],

  architecturalLean: [
    {
      poseModulation:
        'subtle structural leaning with elongated silhouette',

      gazeModulation:
        'detached spatial contemplation',

      garmentMotionModulation:
        'garment contrasted against rigid geometry',

      framingModulation:
        'strong architectural negative space discipline',

      emotionalModulation:
        'sculptural cinematic distance',
    },

    {
      poseModulation:
        'controlled side-body tension with relaxed elegance',

      gazeModulation:
        'minimal direct engagement with emotional restraint',

      garmentMotionModulation:
        'structured silhouette emphasis through stillness',

      framingModulation:
        'balanced architectural framing compression',

      emotionalModulation:
        'quiet luxury minimalism',
    },
  ],

  walkingCouture: [
    {
      poseModulation:
        'slow forward runway-inspired motion',

      gazeModulation:
        'focused cinematic forward attention',

      garmentMotionModulation:
        'fabric flow emphasized through controlled movement',

      framingModulation:
        'cinematic movement depth layering',

      emotionalModulation:
        'refined luxury motion energy',
    },

    {
      poseModulation:
        'mid-step editorial still capture',

      gazeModulation:
        'soft peripheral awareness',

      garmentMotionModulation:
        'textile movement balanced with silhouette preservation',

      framingModulation:
        'editorial movement compression',

      emotionalModulation:
        'cinematic couture fluidity',
    },
  ],

  reflectivePortrait: [
    {
      poseModulation:
        'still introspective portrait posture',

      gazeModulation:
        'emotionally distant reflective gaze',

      garmentMotionModulation:
        'minimal textile motion with texture emphasis',

      framingModulation:
        'soft emotional close framing',

      emotionalModulation:
        'poetic cinematic silence',
    },

    {
      poseModulation:
        'gentle upper-body softness with relaxed posture',

      gazeModulation:
        'unfocused contemplative visual direction',

      garmentMotionModulation:
        'subtle garment drape realism',

      framingModulation:
        'restrained portrait intimacy',

      emotionalModulation:
        'nostalgic luxury stillness',
    },
  ],

  closeupTexture: [
    {
      poseModulation:
        'controlled close-range stillness',

      gazeModulation:
        'soft luxury beauty editorial focus',

      garmentMotionModulation:
        'embroidery and textile micro-detail emphasis',

      framingModulation:
        'tight couture texture framing',

      emotionalModulation:
        'intimate editorial sophistication',
    },

    {
      poseModulation:
        'minimal facial movement with texture clarity preservation',

      gazeModulation:
        'quiet cinematic eye focus',

      garmentMotionModulation:
        'fabric detail isolation and couture visibility',

      framingModulation:
        'compressed close editorial framing',

      emotionalModulation:
        'luxury photographic calmness',
    },
  ],
}

export function getShotVariation(
  shotId: ShotArchitectureId,
  seed: number
): ShotVariation {
  const variations =
    shotVariationRegistry[shotId]

  return variations[
    seed % variations.length
  ]
}