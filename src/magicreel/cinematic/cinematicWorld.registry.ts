export type CinematicTheme =
  | "runway"
  | "royal"
  | "urban"
  | "beach";

export interface CinematicWorld {
  theme: CinematicTheme;
  seed: number;

  architecture: string;
  lighting: string;
  floor?: string;
  audience?: string;
  atmosphere: string;
  camera: string;
  lens: string;
  colorTone: string;

  worldSignature: string;
}

/* ------------------------------------------------------- */

const ARCHITECTURE = {
  runway: [
    "brutalist concrete fashion hall",
    "minimalist white couture hall",
    "gold-accent luxury runway stage",
    "industrial steel runway loft",
    "modern glass fashion atrium",
  ],
  royal: [
    "mughal palace courtyard",
    "rajasthani sandstone fort interior",
    "grand marble palace hall",
    "royal arched courtyard with lanterns",
  ],
  urban: [
    "modern city street with tall buildings",
    "graffiti urban alleyway",
    "downtown fashion district street",
    "industrial concrete exterior",
  ],
  beach: [
    "white sand tropical shoreline",
    "rocky mediterranean coast",
    "minimal bali beach",
    "golden hour coastal dune beach",
  ],
};

const LIGHTING_BY_THEME = {
  runway: [
    "cool white fashion lighting",
    "dramatic spotlight lighting",
    "high contrast editorial lighting",
  ],
  royal: [
    "warm golden lantern lighting",
    "golden hour palace glow",
    "soft royal ambient lighting",
  ],
  urban: [
    "cool urban dusk lighting",
    "soft natural daylight",
    "moody street lighting",
  ],
  beach: [
    "warm golden hour lighting",
    "soft sunset beach lighting",
    "bright natural daylight",
  ],
};

const FLOOR = [
  "high gloss reflective floor",
  "matte textured floor",
  "polished marble floor",
  "dark runway floor",
];

const AUDIENCE = [
  "audience seated on both sides",
  "vip fashion audience",
  "minimal blurred audience",
  "subtle silhouetted audience",
];

const ATMOSPHERE = [
  "subtle haze in air",
  "light mist atmosphere",
  "clear crisp air",
  "soft dust particles in light beam",
];

const CAMERA = [
  "eye level camera",
  "slightly low angle camera",
  "slightly elevated perspective",
];

const LENS = [
  "85mm cinematic depth of field",
  "50mm fashion photography lens",
  "high-end editorial lens compression",
];

const COLOR_TONE_BY_THEME = {
  runway: [
    "cool dramatic fashion grading",
    "rich cinematic contrast",
  ],
  royal: [
    "luxury warm color grading",
    "rich golden cinematic grading",
  ],
  urban: [
    "cool dramatic fashion grading",
    "neutral modern color grading",
  ],
  beach: [
    "warm cinematic sunset grading",
    "bright natural beach grading",
  ],
};

/* ------------------------------------------------------- */

function pick<T>(array: T[], seed: number, offset: number): T {
  const index = Math.abs(seed + offset) % array.length;
  return array[index];
}

function normalize(value: string): string {
  return value.replace(/\s+/g, "_").toLowerCase();
}

/* ------------------------------------------------------- */

export function buildWorld(
  theme: CinematicTheme,
  seed: number
): CinematicWorld {
  const architecture = pick(ARCHITECTURE[theme], seed, 1);
  const lighting = pick(LIGHTING_BY_THEME[theme], seed, 2);
  const atmosphere = pick(ATMOSPHERE, seed, 3);
  const camera = pick(CAMERA, seed, 4);
  const lens = pick(LENS, seed, 5);
  const colorTone = pick(COLOR_TONE_BY_THEME[theme], seed, 6);

  const floor =
    theme === "runway"
      ? pick(FLOOR, seed, 7)
      : undefined;

  const audience =
    theme === "runway"
      ? pick(AUDIENCE, seed, 8)
      : undefined;

  const worldSignature = [
    theme,
    normalize(architecture),
    normalize(lighting),
    normalize(colorTone),
  ].join("_");

  return {
    theme,
    seed,
    architecture,
    lighting,
    floor,
    audience,
    atmosphere,
    camera,
    lens,
    colorTone,
    worldSignature,
  };
}