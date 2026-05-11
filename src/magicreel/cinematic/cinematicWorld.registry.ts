export type CinematicWorldId =
  | "dark-aristocracy"
  | "garden-nostalgia"
  | "royal-solitude"
  | "museum-couture"
  | "poetic-nature";

export interface CinematicWorld {
  id: CinematicWorldId;

  title: string;

  shortDescription: string;

  emotionalCore: string;

  atmosphere: string;

  visualNarrative: string;

  compositionLanguage: string;

  lightingLanguage: string;

  environmentLanguage: string[];

  stylingLanguage: string;

  poseBehavior: string;

  cameraBehavior: string;

  textureLanguage: string;

  luxuryCodes: string[];

  colorPsychology: string[];

  negativeLanguage: string[];

  architecturePool: string[];

  lightingPool: string[];

  atmospherePool: string[];

  texturePool: string[];
}

/* ------------------------------------------------------- */

function pick<T>(array: T[], seed: number, offset: number): T {
  const index = Math.abs(seed + offset) % array.length;
  return array[index];
}

/* ------------------------------------------------------- */

export interface ResolvedCinematicWorld {
  id: CinematicWorldId;

  title: string;

  shortDescription: string;

  emotionalCore: string;

  atmosphere: string;

  visualNarrative: string;

  compositionLanguage: string;

  lightingLanguage: string;

  environmentLanguage: string;

  stylingLanguage: string;

  poseBehavior: string;

  cameraBehavior: string;

  textureLanguage: string;

  luxuryCodes: string[];

  colorPsychology: string[];

  negativeLanguage: string[];

  selectedArchitecture: string;

  selectedLighting: string;

  selectedAtmosphere: string;

  selectedTexture: string;

  worldSignature: string;
}

/* ------------------------------------------------------- */

export const cinematicWorldRegistry: CinematicWorld[] = [
  {
    id: "dark-aristocracy",

    title: "Dark Aristocracy",

    shortDescription:
      "Silent old-world power wrapped in shadow, restraint, and aristocratic stillness.",

    emotionalCore:
      "Power through silence. Emotional restraint elevated into timeless luxury.",

    atmosphere:
      "Shadowed aristocratic stillness with museum-like silence and cinematic emotional depth.",

    visualNarrative:
      "A solitary figure existing within an ancient world shaped by heritage, silence, and emotional restraint.",

    compositionLanguage:
      "Centered framing, sculptural symmetry, restrained balance, cinematic negative space, and architectural stillness.",

    lightingLanguage:
      "Directional museum lighting with soft shadow falloff, candle-tone warmth, sculptural contrast, and cinematic darkness.",

    environmentLanguage: [
      "shadowed palace interiors",
      "ancient heritage corridors",
      "dark aristocratic chambers",
      "museum-like architectural spaces",
    ],

    stylingLanguage:
      "Elegant heritage luxury with restrained styling, timeless silhouettes, and garment-first emphasis.",

    poseBehavior:
      "Still, emotionally distant, poised, graceful, and cinematic without exaggerated motion.",

    cameraBehavior:
      "Medium-format editorial realism with cinematic framing and believable luxury photography.",

    textureLanguage:
      "Velvet darkness, cinematic grain, atmospheric haze, rich textile depth, and tactile luxury realism.",

    luxuryCodes: [
      "old-world aristocracy",
      "museum silence",
      "sacred garment framing",
      "heritage luxury",
      "emotional restraint",
      "timeless wealth",
    ],

    colorPsychology: [
      "velvet black",
      "burnt gold",
      "aged bronze",
      "deep espresso",
      "faded ivory",
    ],

    negativeLanguage: [
      "smiling expressions",
      "fashion influencer energy",
      "commercial catalog styling",
      "hyper-glam aesthetics",
      "oversaturated colors",
      "streetwear mood",
      "AI fantasy aesthetics",
      "playful posing",
      "dramatic movement",
    ],

    architecturePool: [
      "shadowed royal palace hall",
      "dark heritage corridor",
      "ancient aristocratic chamber",
      "museum-like royal interior",
    ],

    lightingPool: [
      "sculptural museum spotlighting",
      "soft candlelit contrast",
      "directional palace lighting",
      "cinematic low-light shadowing",
    ],

    atmospherePool: [
      "velvet atmospheric darkness",
      "floating dust in soft light",
      "cinematic stillness",
      "ancient emotional silence",
    ],

    texturePool: [
      "soft cinematic grain",
      "aged luxury textures",
      "velvet shadow depth",
      "heritage surface realism",
    ],
  },

  {
    id: "garden-nostalgia",

    title: "Garden Nostalgia",

    shortDescription:
      "Faded romance and emotional memory inside poetic garden worlds.",

    emotionalCore:
      "Soft longing, faded memory, romantic silence, and emotional tenderness.",

    atmosphere:
      "Dreamlike garden stillness with poetic softness and emotionally nostalgic beauty.",

    visualNarrative:
      "A cinematic figure moving gently through memory, romance, and fading emotional landscapes.",

    compositionLanguage:
      "Organic framing, layered depth, soft asymmetry, cinematic openness, and emotional breathing space.",

    lightingLanguage:
      "Diffused dusk light with soft highlights, mist softness, faded warmth, and romantic cinematic shadows.",

    environmentLanguage: [
      "overgrown palace gardens",
      "monsoon floral courtyards",
      "fog-covered garden pathways",
      "heritage botanical landscapes",
    ],

    stylingLanguage:
      "Romantic luxury silhouettes with restrained femininity and emotionally elegant styling.",

    poseBehavior:
      "Gentle stillness with subtle emotional movement and cinematic softness.",

    cameraBehavior:
      "Filmic editorial realism with soft lens depth and emotionally immersive framing.",

    textureLanguage:
      "Mist atmosphere, floral softness, monsoon haze, faded textures, and cinematic grain.",

    luxuryCodes: [
      "poetic romance",
      "faded nostalgia",
      "slow luxury",
      "cinematic softness",
      "heritage femininity",
    ],

    colorPsychology: [
      "faded rose",
      "sage green",
      "dust ivory",
      "mist beige",
      "monsoon green",
    ],

    negativeLanguage: [
      "party glamour",
      "street-style energy",
      "commercial posing",
      "neon aesthetics",
      "harsh studio lighting",
      "high-fashion aggression",
      "oversharpened beauty",
    ],

    architecturePool: [
      "foggy heritage garden",
      "overgrown stone courtyard",
      "poetic floral pathway",
      "mist-covered botanical estate",
    ],

    lightingPool: [
      "soft dusk glow",
      "diffused monsoon daylight",
      "mist-filtered sunlight",
      "romantic cinematic softness",
    ],

    atmospherePool: [
      "gentle fog movement",
      "floating floral particles",
      "poetic monsoon air",
      "soft nostalgic silence",
    ],

    texturePool: [
      "filmic grain softness",
      "faded floral texture",
      "mist atmosphere realism",
      "soft textile movement",
    ],
  },

  {
    id: "royal-solitude",

    title: "Royal Solitude",

    shortDescription:
      "Regal stillness shaped by emotional isolation and cinematic silence.",

    emotionalCore:
      "Loneliness wrapped in royalty, dignity, and timeless emotional stillness.",

    atmosphere:
      "Expansive silence with restrained grandeur and emotionally isolated luxury.",

    visualNarrative:
      "A solitary regal figure existing quietly within monumental architectural emptiness.",

    compositionLanguage:
      "Large negative space, isolated framing, distant composition, and emotionally restrained symmetry.",

    lightingLanguage:
      "Muted palace daylight with diffused shadows and restrained cinematic tonal contrast.",

    environmentLanguage: [
      "grand palace courtyards",
      "silent marble interiors",
      "vast heritage halls",
      "monumental royal architecture",
    ],

    stylingLanguage:
      "Minimal regal styling with dignified silhouettes and emotionally restrained elegance.",

    poseBehavior:
      "Still, introspective, composed, and emotionally distant.",

    cameraBehavior:
      "Wide cinematic framing with spatial storytelling and editorial realism.",

    textureLanguage:
      "Muted marble softness, cinematic grain, quiet textures, and heritage realism.",

    luxuryCodes: [
      "regal silence",
      "isolated grandeur",
      "architectural luxury",
      "timeless dignity",
      "cinematic loneliness",
    ],

    colorPsychology: [
      "stone ivory",
      "dust gold",
      "muted taupe",
      "ash beige",
      "royal brown",
    ],

    negativeLanguage: [
      "loud glamour",
      "commercial fashion energy",
      "social media posing",
      "party aesthetics",
      "high saturation",
      "street-fashion styling",
    ],

    architecturePool: [
      "vast royal courtyard",
      "silent marble palace hall",
      "grand heritage corridor",
      "isolated architectural chamber",
    ],

    lightingPool: [
      "soft royal daylight",
      "muted palace illumination",
      "diffused marble reflections",
      "restrained cinematic daylight",
    ],

    atmospherePool: [
      "architectural silence",
      "still palace air",
      "soft ambient dust",
      "emotionally distant emptiness",
    ],

    texturePool: [
      "marble softness",
      "quiet grain texture",
      "heritage surface realism",
      "cinematic tonal softness",
    ],
  },

  {
    id: "museum-couture",

    title: "Museum Couture",

    shortDescription:
      "The garment treated as sacred art inside a museum-like world.",

    emotionalCore:
      "Reverence, timeless beauty, and sacred couture preservation.",

    atmosphere:
      "Quiet museum elegance with curated stillness and artistic restraint.",

    visualNarrative:
      "The garment exists as a timeless artifact elevated beyond trend and time.",

    compositionLanguage:
      "Gallery-style framing, sculptural isolation, centered reverence, and exhibition-like composition.",

    lightingLanguage:
      "Controlled gallery lighting with soft spot illumination and subtle museum shadows.",

    environmentLanguage: [
      "museum interiors",
      "sculptural gallery spaces",
      "architectural exhibition halls",
      "curated luxury environments",
    ],

    stylingLanguage:
      "Minimal styling focused entirely on garment craftsmanship and silhouette integrity.",

    poseBehavior:
      "Statuesque stillness with elegant emotional neutrality.",

    cameraBehavior:
      "Editorial precision with medium-format realism and museum photography influence.",

    textureLanguage:
      "Fine textile realism, matte atmosphere, soft grain, and sculptural texture depth.",

    luxuryCodes: [
      "sacred couture",
      "museum elegance",
      "garment-first storytelling",
      "editorial reverence",
      "timeless fashion",
    ],

    colorPsychology: [
      "gallery ivory",
      "stone grey",
      "soft charcoal",
      "aged cream",
      "muted bronze",
    ],

    negativeLanguage: [
      "visual clutter",
      "busy compositions",
      "social media aesthetics",
      "fashion influencer styling",
      "dramatic glamour",
      "streetwear energy",
    ],

    architecturePool: [
      "minimalist museum gallery",
      "sculptural exhibition hall",
      "curated architectural interior",
      "luxury art-space environment",
    ],

    lightingPool: [
      "soft gallery spotlighting",
      "controlled museum illumination",
      "subtle sculptural shadows",
      "editorial exhibition lighting",
    ],

    atmospherePool: [
      "curated silence",
      "still museum air",
      "architectural calmness",
      "timeless editorial restraint",
    ],

    texturePool: [
      "matte luxury surfaces",
      "fine textile realism",
      "soft museum grain",
      "sculptural depth textures",
    ],
  },

  {
    id: "poetic-nature",

    title: "Poetic Nature",

    shortDescription:
      "Nature-driven cinematic emotion with atmospheric softness and poetic realism.",

    emotionalCore:
      "Human emotion dissolved into landscape, atmosphere, and cinematic nature.",

    atmosphere:
      "Foggy landscapes, poetic wind, dusk atmosphere, and emotionally immersive natural stillness.",

    visualNarrative:
      "A cinematic figure emotionally connected to landscape, weather, and atmospheric silence.",

    compositionLanguage:
      "Wide cinematic framing, atmospheric openness, natural balance, and environmental emotional depth.",

    lightingLanguage:
      "Soft dusk light with fog diffusion, atmospheric shadows, and cinematic natural glow.",

    environmentLanguage: [
      "fog-covered mountains",
      "windswept landscapes",
      "monsoon valleys",
      "cinematic natural terrain",
    ],

    stylingLanguage:
      "Elegant silhouettes integrated naturally into atmospheric environments.",

    poseBehavior:
      "Contemplative stillness with subtle cinematic movement and emotional softness.",

    cameraBehavior:
      "Wide-lens editorial realism with environmental storytelling and fashion-film composition.",

    textureLanguage:
      "Fog texture, cinematic haze, organic grain, and natural atmospheric softness.",

    luxuryCodes: [
      "poetic realism",
      "nature luxury",
      "slow emotional storytelling",
      "editorial stillness",
      "cinematic atmosphere",
    ],

    colorPsychology: [
      "fog grey",
      "forest green",
      "earth brown",
      "mist blue",
      "stone beige",
    ],

    negativeLanguage: [
      "urban energy",
      "party aesthetics",
      "commercial fashion mood",
      "high-glam styling",
      "studio atmosphere",
      "oversaturated visuals",
    ],

    architecturePool: [
      "foggy mountain landscape",
      "windswept natural terrain",
      "monsoon hillside environment",
      "cinematic wilderness space",
    ],

    lightingPool: [
      "soft fog-filtered daylight",
      "atmospheric dusk glow",
      "natural cinematic diffusion",
      "mist-softened shadows",
    ],

    atmospherePool: [
      "floating mountain fog",
      "gentle wind movement",
      "poetic atmospheric silence",
      "natural cinematic haze",
    ],

    texturePool: [
      "organic film grain",
      "fog texture realism",
      "natural softness",
      "cinematic environmental depth",
    ],
  },
];

/* ------------------------------------------------------- */

export function buildEditorialWorld(
  worldId: CinematicWorldId,
  seed: number
): ResolvedCinematicWorld {
  const world = cinematicWorldRegistry.find((w) => w.id === worldId);

  if (!world) {
    throw new Error(`Unknown cinematic world: ${worldId}`);
  }

  const selectedArchitecture = pick(world.architecturePool, seed, 1);

  const selectedLighting = pick(world.lightingPool, seed, 2);

  const selectedAtmosphere = pick(world.atmospherePool, seed, 3);

  const selectedTexture = pick(world.texturePool, seed, 4);

  const worldSignature = [
    world.id,
    selectedArchitecture,
    selectedLighting,
  ]
    .join("_")
    .replace(/\s+/g, "_")
    .toLowerCase();

  return {
    id: world.id,

    title: world.title,

    shortDescription: world.shortDescription,

    emotionalCore: world.emotionalCore,

    atmosphere: world.atmosphere,

    visualNarrative: world.visualNarrative,

    compositionLanguage: world.compositionLanguage,

    lightingLanguage: world.lightingLanguage,

    environmentLanguage: pick(world.environmentLanguage, seed, 5),

    stylingLanguage: world.stylingLanguage,

    poseBehavior: world.poseBehavior,

    cameraBehavior: world.cameraBehavior,

    textureLanguage: world.textureLanguage,

    luxuryCodes: world.luxuryCodes,

    colorPsychology: world.colorPsychology,

    negativeLanguage: world.negativeLanguage,

    selectedArchitecture,

    selectedLighting,

    selectedAtmosphere,

    selectedTexture,

    worldSignature,
  };
}