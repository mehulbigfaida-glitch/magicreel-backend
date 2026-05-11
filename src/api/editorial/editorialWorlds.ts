function randomItem(items: string[]) {
  return items[
    Math.floor(
      Math.random() * items.length
    )
  ];
}

/* =========================================
   DARK ARISTOCRACY
========================================= */

const darkAristocracyEnvironment = [
  "shadowed palace corridor with sculptural arches",
  "dim aristocratic chamber with cinematic silence",
  "heritage palace balcony with restrained grandeur",
  "aged royal interior with atmospheric darkness",
  "stone hallway with elongated shadow geometry",
  "quiet palace staircase with cinematic isolation",
];

const darkAristocracyCamera = [
  "low-angle cinematic portrait framing",
  "editorial medium-distance composition",
  "controlled asymmetric fashion framing",
  "cinematic close portrait perspective",
  "wide environmental editorial composition",
  "architectural negative-space framing",
];

const darkAristocracyPose = [
  "emotionally restrained still posture",
  "subtle side-body tension with composed elegance",
  "minimal direct engagement with psychological distance",
  "quiet aristocratic standing posture",
  "controlled silhouette emphasis with luxury restraint",
  "soft architectural interaction pose",
];

const darkAristocracyLighting = [
  "sculptural low-key cinematic lighting",
  "deep shadow separation with soft facial falloff",
  "directional aristocratic shadow architecture",
  "muted palace light with cinematic depth",
  "analog monochrome light discipline",
  "controlled chiaroscuro luxury lighting",
];

/* =========================================
   GARDEN NOSTALGIA
========================================= */

const gardenEnvironment = [
  "forgotten botanical estate garden",
  "fading romantic courtyard with aged florals",
  "melancholic heritage greenhouse atmosphere",
  "weathered garden ruins with cinematic softness",
  "botanical silence with nostalgic architecture",
  "poetic outdoor estate composition",
];

const gardenCamera = [
  "soft cinematic portrait framing",
  "romantic environmental editorial composition",
  "botanical depth composition",
  "editorial medium portrait distance",
  "garden negative-space framing",
];

const gardenPose = [
  "gentle emotionally distant posture",
  "quiet romantic stillness",
  "soft contemplative fashion posture",
  "natural poetic body language",
  "restrained emotional elegance",
];

const gardenLighting = [
  "soft diffused nostalgic daylight",
  "melancholic cinematic garden light",
  "romantic overcast editorial lighting",
  "faded analog sunlight atmosphere",
  "gentle botanical light falloff",
];

/* =========================================
   CELESTIAL SILENCE
========================================= */

const celestialEnvironment = [
  "reflective midnight environment",
  "minimal surreal cinematic space",
  "atmospheric reflective water composition",
  "vast emotional negative-space environment",
  "midnight-blue contemplative landscape",
  "floating cinematic silence atmosphere",
];

const celestialCamera = [
  "minimalist editorial framing",
  "wide cinematic spatial composition",
  "contemplative portrait isolation framing",
  "surreal negative-space composition",
  "soft luxury cinematic portrait distance",
];

const celestialPose = [
  "emotionally silent still posture",
  "minimal contemplative body language",
  "quiet cinematic isolation",
  "restrained surreal elegance",
  "calm reflective posture",
];

const celestialLighting = [
  "soft midnight cinematic glow",
  "atmospheric blue-gradient lighting",
  "minimal reflective cinematic illumination",
  "soft surreal environmental lighting",
  "controlled celestial light separation",
];

/* =========================================
   PROMPT BUILDERS
========================================= */

function buildDarkAristocracyPrompt() {
  return `
Use the uploaded hero image as the primary subject reference.

Preserve:
- facial identity
- hairstyle
- garment design
- textile details
- embroidery
- silhouette structure
- body proportions
- realistic fashion anatomy
- couture styling integrity

Do not redesign the garment.
Do not alter subject identity.

If a brand logo is provided, integrate it naturally into the editorial composition with restrained luxury placement.
Avoid oversized branding.
Maintain premium fashion campaign subtlety.

Transform the uploaded image into a luxury cinematic editorial campaign.

Emotionally restrained aristocratic cinematic world.
Shadowed palace architecture.
Analog monochrome realism.
Psychological distance.
Narrative environmental storytelling.

${randomItem(
  darkAristocracyEnvironment
)}.

${randomItem(
  darkAristocracyCamera
)}.

${randomItem(
  darkAristocracyPose
)}.

${randomItem(
  darkAristocracyLighting
)}.

Velvet black.
Burnt gold.
Aged bronze.
Deep espresso.
Faded ivory.
Sculptural shadows.
Palace silence.
Aristocratic stillness.

Portrait 4:5 editorial campaign composition.

Avoid ecommerce posing.
Avoid influencer aesthetics.
Avoid synthetic skin retouching.
Avoid oversaturated cinematic grading.
Avoid generic ai-fashion rendering.
`;
}

function buildGardenPrompt() {
  return `
Use the uploaded hero image as the primary subject reference.

Preserve garment integrity and subject identity.

Transform the uploaded image into a fading romantic editorial world.

${randomItem(
  gardenEnvironment
)}.

${randomItem(
  gardenCamera
)}.

${randomItem(
  gardenPose
)}.

${randomItem(
  gardenLighting
)}.

Melancholic botanical stillness.
Emotional nostalgia.
Poetic luxury realism.
Narrative environmental softness.

Portrait 4:5 editorial composition.

Avoid ecommerce aesthetics.
Avoid influencer styling.
Avoid synthetic rendering.
`;
}

function buildCelestialPrompt() {
  return `
Use the uploaded hero image as the primary subject reference.

Preserve garment integrity and subject identity.

Transform the uploaded image into a surreal luxury cinematic atmosphere.

${randomItem(
  celestialEnvironment
)}.

${randomItem(
  celestialCamera
)}.

${randomItem(
  celestialPose
)}.

${randomItem(
  celestialLighting
)}.

Emotional silence.
Contemplative cinematic stillness.
Reflective spatial minimalism.
Luxury atmospheric realism.

Portrait 4:5 editorial composition.

Avoid generic ai aesthetics.
Avoid visual clutter.
Avoid oversaturated surrealism.
`;
}

/* =========================================
   EXPORT REGISTRY
========================================= */

export function buildWorldPrompt(
  worldId: string
) {
  switch (worldId) {
    case "dark-aristocracy":
      return buildDarkAristocracyPrompt();

    case "garden-nostalgia":
      return buildGardenPrompt();

    case "celestial-silence":
      return buildCelestialPrompt();

    default:
      return buildDarkAristocracyPrompt();
  }
}