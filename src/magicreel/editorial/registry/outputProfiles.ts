/**
 * ============================================================
 * MagicReel Output Profiles Registry V2
 * ============================================================
 *
 * Output Profiles define HOW an editorial image should be
 * photographed for a particular canvas.
 *
 * They never define:
 * - Editorial World
 * - Mood
 * - Environment
 * - Behaviour
 *
 * Those belong to the Editorial World.
 */

export interface OutputProfile {

  id: string;

  name: string;

  orientation:
    | "portrait"
    | "landscape"
    | "square";

  imageSize: {
  width: number;
  height: number;
};

  composition: string[];

  framing: string[];

  hierarchy: string[];

  avoid: string[];

}

export const outputProfiles: Record<string, OutputProfile> = {

  "landscape-16-9": {

    id: "landscape-16-9",

    name: "Landscape 16:9",

    orientation: "landscape",

    imageSize: {
  width: 2048,
  height: 1152,
},

    composition: [

      "wide cinematic composition",

      "luxury editorial storytelling",

      "strong environmental balance",

      "natural horizontal visual flow",

      "garment remains immediately visible",

      "premium fashion campaign framing"

    ],

    framing: [

      "wide landscape framing",

      "full body preferred",

      "allow architectural storytelling",

      "balanced left and right breathing room",

      "natural cinematic perspective"

    ],

    hierarchy: [

      "garment remains primary subject",

      "model is secondary subject",

      "environment enhances the narrative",

      "background never dominates"

    ],

    avoid: [

      "tight portrait crops",

      "empty panoramic space",

      "tiny distant fashion model",

      "background overpowering subject"

    ]

  },

  "portrait-2-3": {

    id: "portrait-2-3",

    name: "Portrait 2:3",

    orientation: "portrait",

    imageSize: {
  width: 1280,
  height: 1920,
},

    composition: [

      "classic luxury portrait composition",

      "balanced vertical framing",

      "editorial breathing room",

      "strong garment visibility",

      "premium fashion presentation"

    ],

    framing: [

      "medium to full body",

      "balanced camera distance",

      "natural luxury proportions",

      "comfortable negative space"

    ],

    hierarchy: [

      "garment is primary focus",

      "model naturally commands attention",

      "environment supports the story"

    ],

    avoid: [

      "tight crops",

      "extreme close ups",

      "horizontal framing",

      "busy backgrounds"

    ]

  },

  "portrait-4-5": {

    id: "portrait-4-5",

    name: "Portrait 4:5",

    orientation: "portrait",

    imageSize: {
  width: 1280,
  height: 1600,
},

    composition: [

      "mobile-first luxury composition",

      "editorial fashion framing",

      "slightly tighter crop",

      "subject dominates the frame",

      "premium visual balance"

    ],

    framing: [

      "full body when possible",

      "strong vertical composition",

      "minimal wasted space",

      "comfortable luxury proportions"

    ],

    hierarchy: [

      "garment always dominates",

      "model remains elegant",

      "environment complements the fashion"

    ],

    avoid: [

      "wide cinematic framing",

      "large empty borders",

      "distant compositions",

      "background distractions"

    ]

  },

  "square-1-1": {

    id: "square-1-1",

    name: "Square 1:1",

    orientation: "square",

    imageSize: {
  width: 1440,
  height: 1440,
},

    composition: [

      "balanced square composition",

      "editorial symmetry",

      "luxury visual balance",

      "central garment emphasis"

    ],

    framing: [

      "balanced composition",

      "medium or full body",

      "equal breathing room"

    ],

    hierarchy: [

      "garment remains primary",

      "model supports garment",

      "environment remains subtle"

    ],

    avoid: [

      "off-balance framing",

      "large empty corners",

      "background dominance"

    ]

  },

  "portrait-9-16": {

    id: "portrait-9-16",

    name: "Portrait 9:16",

    orientation: "portrait",

    imageSize: {
  width: 1152,
  height: 2048,
},

    composition: [

      "immersive vertical storytelling",

      "luxury mobile-first composition",

      "strong vertical visual flow",

      "premium editorial atmosphere"

    ],

    framing: [

      "full height composition",

      "full body preferred",

      "vertical luxury framing",

      "comfortable mobile viewing"

    ],

    hierarchy: [

      "garment remains primary subject",

      "model naturally commands attention",

      "environment enhances storytelling"

    ],

    avoid: [

      "horizontal layouts",

      "wide cinematic crops",

      "tiny distant subject",

      "background overpowering fashion"

    ]

  }

} as const;

export function getOutputProfile(
  id: string
): OutputProfile {

  const profile =
    outputProfiles[id];

  if (!profile) {

    throw new Error(
      `Unknown output profile: ${id}`
    );

  }

  return profile;

}