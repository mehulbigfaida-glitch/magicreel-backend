interface EditorialDraftPromptInput {
  editorialWorld: string;

  output: string;
}

/* =========================================
   RANDOM HELPER
========================================= */

function randomItem(
  items: string[]
) {
  return items[
    Math.floor(
      Math.random() *
        items.length
    )
  ];
}

/* =========================================
   WORLD IDENTITIES
========================================= */

const WORLD_DIRECTION: Record<
  string,
  string
> = {
  "dark-aristocracy": `
Emotionally restrained aristocratic cinematic world.
Shadowed palace architecture.
Analog monochrome realism.
Psychological distance.
Narrative environmental storytelling.
Velvet black.
Burnt gold.
Aged bronze.
Deep espresso.
Faded ivory.
Sculptural shadows.
Palace silence.
Aristocratic stillness.
`,

  "poetic-nature": `
Soft cinematic fashion storytelling inspired by natural light, emotional silence, poetic environmental realism, botanical atmosphere, wind movement, and romantic visual calmness.
`,

  "museum-couture": `
Architectural couture editorial atmosphere where garments feel sculptural, timeless, spatially composed, and emotionally restrained.
`,

  "noir-couture": `
Vintage cinematic noir editorial atmosphere with psychological darkness, monochrome elegance, restrained glamour, and shadow-heavy luxury realism.
`,

  "heritage-romance": `
Heirloom-inspired couture storytelling with romantic emotional softness, antique textures, timeless luxury atmosphere, and faded aristocratic nostalgia.
`,

  "runway-editorial": `
Luxury runway editorial realism with backstage cinematic energy, fashion-week atmosphere, editorial confidence, and premium couture movement.
`,

  "urban-luxury-cinema": `
Modern European luxury fashion cinema with reflective metropolitan atmosphere, cinematic nightlife realism, editorial confidence, and premium architectural environments.
`,
};

/* =========================================
   OUTPUTS
========================================= */

const OUTPUT_DIRECTION: Record<
  string,
  string
> = {
  "instagram-post": `
Portrait 4:5 editorial campaign composition with premium luxury photography realism.
`,

  story: `
Vertical cinematic editorial composition optimized for immersive luxury storytelling.
`,
};

/* =========================================
   CINEMATIC VARIATION
========================================= */

const CAMERA_VARIATIONS = [
  "wide cinematic environmental framing",
  "editorial medium-distance portrait composition",
  "close cinematic luxury portrait framing",
  "asymmetrical fashion-magazine composition",
  "architectural negative-space framing",
  "subject isolation with cinematic distance",
];

const LIGHTING_VARIATIONS = [
  "sculptural low-key cinematic lighting",
  "soft directional editorial lighting",
  "deep shadow-separated luxury lighting",
  "analog monochrome light falloff",
  "cinematic chiaroscuro atmosphere",
  "dim atmospheric editorial illumination",
];

const POSE_VARIATIONS = [
  "emotionally restrained still posture",
  "quiet editorial body language",
  "controlled couture silhouette emphasis",
  "subtle natural movement with cinematic restraint",
  "minimal direct engagement with emotional distance",
  "composed luxury stillness",
];

const ENVIRONMENT_VARIATIONS =
  [
    "architectural environmental storytelling",
    "cinematic palace atmosphere",
    "luxury spatial depth realism",
    "editorial environmental asymmetry",
    "museum-like cinematic silence",
    "emotionally restrained spatial composition",
  ];

/* =========================================
   NEGATIVE SYSTEM
========================================= */

const NEGATIVE_DIRECTION = `
Avoid poster layouts.
Avoid influencer aesthetics.
Avoid plastic skin.
Avoid synthetic fashion rendering.
Avoid ecommerce posing.
Avoid centered symmetry.
Avoid oversaturated cinematic grading.
Avoid artificial glamour styling.
Avoid generic ai-fashion aesthetics.
Avoid cluttered environments.
`;

/* =========================================
   MAIN BUILDER
========================================= */

export function buildEditorialDraftPrompt(
  input: EditorialDraftPromptInput
) {
  const worldDirection =
    WORLD_DIRECTION[
      input.editorialWorld
    ] || "";

  const outputDirection =
    OUTPUT_DIRECTION[
      input.output
    ] || "";

  const cameraVariation =
    randomItem(
      CAMERA_VARIATIONS
    );

  const lightingVariation =
    randomItem(
      LIGHTING_VARIATIONS
    );

  const poseVariation =
    randomItem(
      POSE_VARIATIONS
    );

  const environmentVariation =
    randomItem(
      ENVIRONMENT_VARIATIONS
    );

  return `
Create a cinematic luxury fashion campaign photograph using the uploaded hero image.

Maintain:
- exact garment realism
- embroidery accuracy
- fabric texture integrity
- silhouette accuracy
- facial identity realism

The result must feel like a real luxury fashion editorial photograph captured during a premium cinematic photoshoot.

Visual direction:
- cinematic photographic realism
- luxury editorial atmosphere
- believable environmental depth
- restrained emotional storytelling
- subtle asymmetry
- natural fashion-magazine realism

Composition:
${cameraVariation}

Lighting:
${lightingVariation}

Pose direction:
${poseVariation}

Environmental direction:
${environmentVariation}

${worldDirection}

${outputDirection}

${NEGATIVE_DIRECTION}
`;
}