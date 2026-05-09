export type EditorialWorld =
  | "dark-aristocracy"
  | "poetic-nature"
  | "museum-couture"
  | "noir-couture"
  | "heritage-romance"
  | "runway-editorial"
  | "urban-luxury-cinema";

export type CampaignOutput =
  | "instagram-post"
  | "story";

interface EditorialPromptInput {
  editorialWorld: EditorialWorld;

  output: CampaignOutput;
}

const WORLD_DNA: Record<
  string,
  string
> = {
  "dark-aristocracy": `
Old-money cinematic couture portraiture with emotional restraint, sculptural shadows, aristocratic stillness, museum-grade darkness, luxury silence, psychologically distant fashion realism.
`,

  "poetic-nature": `
Poetic cinematic fashion storytelling with romantic environmental realism, soft atmospheric movement, emotional stillness, natural luxury light, dreamlike couture atmosphere.
`,

  "museum-couture": `
Architectural couture presentation with museum-grade composition, gallery realism, sculptural fashion posture, spatial discipline, timeless luxury minimalism.
`,

  "noir-couture": `
Vintage Vogue-inspired monochrome cinematic couture with psychological mystery, elegant darkness, shadow-heavy editorial realism, restrained noir glamour.
`,

  "heritage-romance": `
Heirloom couture storytelling with nostalgic luxury atmosphere, antique emotional softness, romantic silence, heritage architecture, timeless emotional realism.
`,

  "runway-editorial": `
Luxury fashion-week realism with backstage cinematic atmosphere, documentary-style runway energy, spontaneous editorial movement, modern Vogue fashion realism.
`,

  "urban-luxury-cinema": `
Modern cinematic luxury inspired by Gucci and Louis Vuitton campaigns, reflective nightlife realism, emotionally surreal city atmosphere, psychologically stylish fashion storytelling.
`,
};

const OUTPUT_DNA: Record<
  string,
  string
> = {
  "instagram-post": `
Luxury editorial Instagram composition with cinematic framing, premium focal hierarchy, fashion-magazine realism, and restrained visual balance.
`,

  story: `
Vertical cinematic luxury storytelling optimized for immersive mobile viewing with emotionally directed portrait composition and fashion-film realism.
`,
};

const NEGATIVE_DNA = `
Avoid:
- AI aesthetics
- mannequin posing
- catalog photography
- influencer styling
- plastic skin
- distorted anatomy
- oversaturated colors
- synthetic fashion rendering
- generic luxury advertising
`;

export function buildEditorialPrompt(
  input: EditorialPromptInput
) {
  const worldDNA =
    WORLD_DNA[
      input.editorialWorld
    ] || "";

  const outputDNA =
    OUTPUT_DNA[
      input.output
    ] || "";

  return `
CINEMATIC FASHION-HOUSE EDITORIAL CAMPAIGN.

Preserve the uploaded garment identity with luxury-level realism.

Maintain:
- embroidery authenticity
- couture silhouette
- textile realism
- garment construction integrity
- luxury tailoring accuracy
- premium fashion realism

Preserve the uploaded model identity while allowing editorial reinterpretation.

DO NOT preserve:
- exact pose
- exact framing
- exact stance
- exact body positioning

Generate:
- new editorial posture
- cinematic body language
- fashion-film realism
- environmental interaction
- luxury campaign movement
- asymmetrical editorial composition
- cinematic walking realism
- emotionally directed posing
- medium-format fashion photography realism

The image should feel:
- photographed
- directed
- cinematic
- editorially intelligent
- emotionally authored

Avoid:
- mannequin posture
- static catalog posing
- influencer aesthetics
- perfect symmetry
- generic luxury posing

Behave like an elite Vogue fashion photographer using cinematic medium-format fashion photography.

Use:
- cinematic lens realism
- luxury shadow discipline
- subtle environmental storytelling
- natural photographic imperfection
- premium visual restraint
- emotional framing realism

${worldDNA}

${outputDNA}

${NEGATIVE_DNA}
`;
}