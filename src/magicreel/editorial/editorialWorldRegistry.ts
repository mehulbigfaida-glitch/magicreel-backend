export type EditorialWorld = {
  id: string;

  label: string;

  emotionalThesis: string;

  visualIdentity: string[];

  lightingGrammar: string[];

  poseGrammar: string[];

  cameraGrammar: string[];

  typographyGrammar: string[];

  colorGovernance: string[];

  atmosphereRules: string[];

  restraintRules: string[];

  forbiddenBehaviors: string[];

  bestFor: string[];

  garmentMappings: string[];
};

export const editorialWorldRegistry: EditorialWorld[] = [
  {
    id: "dark-aristocracy",

    label: "Dark Aristocracy",

    emotionalThesis:
      "Emotionally restrained couture portraiture with sculptural authority and museum-grade darkness.",

    visualIdentity: [
      "black seamless backgrounds",
      "deep shadow falloff",
      "monochrome restraint",
      "sculptural couture presentation",
      "museum-grade portrait framing",
    ],

    lightingGrammar: [
      "single sculptural key light",
      "controlled shadow depth",
      "negative fill",
      "museum contrast",
      "soft highlight restraint",
    ],

    poseGrammar: [
      "restrained posing",
      "minimal hand motion",
      "editorial stillness",
      "quiet authority",
      "slow body language",
    ],

    cameraGrammar: [
      "medium portrait framing",
      "luxury negative space",
      "tight couture focus",
      "symmetrical balance",
    ],

    typographyGrammar: [
      "minimal typography",
      "small editorial placement",
      "luxury spacing",
      "high-end restraint",
    ],

    colorGovernance: [
      "muted palettes",
      "monochrome leaning",
      "controlled saturation",
      "deep blacks",
    ],

    atmosphereRules: [
      "emotional silence",
      "cinematic darkness",
      "museum-grade restraint",
      "high-fashion stillness",
    ],

    restraintRules: [
      "avoid excessive drama",
      "avoid oversaturated lighting",
      "avoid chaotic styling",
      "avoid busy backgrounds",
    ],

    forbiddenBehaviors: [
      "neon colors",
      "streetwear energy",
      "playful posing",
      "high saturation",
      "fast movement",
    ],

    bestFor: [
      "black couture gowns",
      "structured luxury silhouettes",
      "high jewelry couture",
      "luxury eveningwear",
    ],

    garmentMappings: [
      "black evening gown",
      "sculptural couture",
      "luxury monochrome dress",
      "high-fashion western gown",
    ],
  },

  {
    id: "poetic-nature",

    label: "Poetic Nature",

    emotionalThesis:
      "Romantic environmental storytelling with emotional stillness and cinematic natural beauty.",

    visualIdentity: [
      "fog",
      "mountains",
      "grasslands",
      "cinematic dusk",
      "poetic landscapes",
    ],

    lightingGrammar: [
      "soft dusk light",
      "cinematic haze",
      "natural diffusion",
      "low contrast lighting",
    ],

    poseGrammar: [
      "gentle movement",
      "romantic stillness",
      "soft gaze",
      "slow emotional posing",
    ],

    cameraGrammar: [
      "wide environmental framing",
      "cinematic scale",
      "subject isolation",
      "landscape integration",
    ],

    typographyGrammar: [
      "minimal serif typography",
      "subtle editorial placement",
      "quiet luxury spacing",
    ],

    colorGovernance: [
      "earthy tones",
      "soft florals",
      "muted greens",
      "natural romantic palettes",
    ],

    atmosphereRules: [
      "emotional calmness",
      "nature immersion",
      "cinematic poetry",
      "soft luxury emotion",
    ],

    restraintRules: [
      "avoid harsh contrast",
      "avoid artificial lighting",
      "avoid excessive glamour",
    ],

    forbiddenBehaviors: [
      "urban environments",
      "flash lighting",
      "neon palettes",
      "aggressive posing",
    ],

    bestFor: [
      "bridal lehengas",
      "floral sarees",
      "romantic couture",
      "luxury ethnicwear",
    ],

    garmentMappings: [
      "bridal lehenga",
      "pastel couture",
      "embroidered saree",
      "romantic gown",
    ],
  },

  {
    id: "museum-couture",

    label: "Museum Couture",

    emotionalThesis:
      "Fashion presented as timeless sculptural art with architectural restraint and gallery-like composition.",

    visualIdentity: [
      "gallery environments",
      "architectural framing",
      "symmetry",
      "artifact presentation",
    ],

    lightingGrammar: [
      "soft museum lighting",
      "controlled highlights",
      "architectural shadows",
    ],

    poseGrammar: [
      "statuesque posture",
      "minimal movement",
      "symmetrical posing",
      "editorial stillness",
    ],

    cameraGrammar: [
      "centered framing",
      "architectural balance",
      "full silhouette presentation",
    ],

    typographyGrammar: [
      "gallery-style typography",
      "ultra-minimal placement",
      "museum restraint",
    ],

    colorGovernance: [
      "neutral palettes",
      "soft luxury contrast",
      "controlled color depth",
    ],

    atmosphereRules: [
      "timelessness",
      "gallery silence",
      "luxury precision",
    ],

    restraintRules: [
      "avoid clutter",
      "avoid excessive motion",
      "avoid dramatic effects",
    ],

    forbiddenBehaviors: [
      "streetwear mood",
      "party energy",
      "chaotic environments",
    ],

    bestFor: [
      "structured gowns",
      "couture dresses",
      "architectural silhouettes",
      "luxury western wear",
    ],

    garmentMappings: [
      "structured western gown",
      "sculptural dress",
      "premium couture",
    ],
  },

  {
    id: "modern-minimal-luxury",

    label: "Modern Minimal Luxury",

    emotionalThesis:
      "Quiet luxury with architectural minimalism, affluent restraint, and modern editorial sophistication.",

    visualIdentity: [
      "minimal interiors",
      "neutral luxury spaces",
      "architectural framing",
      "clean visual silence",
    ],

    lightingGrammar: [
      "soft directional light",
      "natural luxury lighting",
      "clean shadow control",
    ],

    poseGrammar: [
      "effortless confidence",
      "relaxed luxury posture",
      "quiet authority",
    ],

    cameraGrammar: [
      "clean compositions",
      "editorial crop balance",
      "negative space discipline",
    ],

    typographyGrammar: [
      "minimal sans-serif typography",
      "high-end spacing",
      "quiet branding",
    ],

    colorGovernance: [
      "neutral palettes",
      "cream tones",
      "beige luxury",
      "soft monochrome",
    ],

    atmosphereRules: [
      "quiet wealth",
      "modern sophistication",
      "editorial realism",
    ],

    restraintRules: [
      "avoid excessive drama",
      "avoid over-styling",
      "avoid visual noise",
    ],

    forbiddenBehaviors: [
      "heavy cinematic effects",
      "neon colors",
      "chaotic fashion energy",
    ],

    bestFor: [
      "midi dresses",
      "luxury casuals",
      "blazers",
      "co-ord sets",
      "premium western wear",
    ],

    garmentMappings: [
      "minimal midi dress",
      "quiet luxury outfit",
      "structured blazer",
      "premium casual wear",
    ],
  },

  {
    id: "urban-luxury-cinema",

    label: "Urban Luxury Cinema",

    emotionalThesis:
      "Modern cinematic nightlife luxury with emotional coolness, urban reflections, and fashion authority.",

    visualIdentity: [
      "wet streets",
      "night reflections",
      "city lights",
      "luxury nightlife atmosphere",
    ],

    lightingGrammar: [
      "cinematic flash",
      "urban glow",
      "night contrast",
      "luxury reflections",
    ],

    poseGrammar: [
      "confident movement",
      "editorial coolness",
      "fashion attitude",
    ],

    cameraGrammar: [
      "dynamic framing",
      "editorial motion stillness",
      "street luxury composition",
    ],

    typographyGrammar: [
      "bold minimal typography",
      "fashion-week spacing",
      "editorial edge",
    ],

    colorGovernance: [
      "deep blacks",
      "metallic highlights",
      "night tones",
      "luxury contrast",
    ],

    atmosphereRules: [
      "nightlife sophistication",
      "urban cinematic tension",
      "modern fashion coolness",
    ],

    restraintRules: [
      "avoid overexposed neon",
      "avoid chaotic crowds",
      "avoid artificial AI look",
    ],

    forbiddenBehaviors: [
      "playful fashion styling",
      "bright daylight",
      "cartoonish nightlife",
    ],

    bestFor: [
      "evening gowns",
      "partywear",
      "luxury western dresses",
      "metallic couture",
    ],

    garmentMappings: [
      "black satin dress",
      "cocktail gown",
      "luxury nightlife outfit",
      "high-fashion western eveningwear",
    ],
  },
];