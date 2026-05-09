interface EditorialDraftPromptInput {
  editorialWorld: string;

  output: string;
}

const WORLD_DIRECTION: Record<
  string,
  string
> = {
  "dark-aristocracy": `
Quiet aristocratic couture portraiture with sculptural shadows, cinematic darkness, aged architectural atmosphere, restrained luxury emotion, and museum-like stillness.
`,

  "poetic-nature": `
Soft cinematic fashion storytelling inspired by natural light, wind movement, emotional calmness, and poetic environmental realism.
`,

  "museum-couture": `
Architectural luxury editorial framing where the garment feels like a timeless couture artifact presented within a refined spatial environment.
`,

  "noir-couture": `
Vintage-inspired cinematic noir fashion editorial with shadow-heavy lighting, emotional restraint, elegant darkness, and sophisticated editorial realism.
`,

  "heritage-romance": `
Heirloom-inspired couture storytelling with romantic heritage atmosphere, antique textures, emotional softness, and timeless luxury realism.
`,

  "runway-editorial": `
Luxury fashion-week atmosphere with cinematic backstage realism, subtle movement, editorial confidence, and premium runway energy.
`,

  "urban-luxury-cinema": `
Modern luxury fashion cinema inspired by high-end European campaigns, reflective city environments, cinematic nightlife mood, and confident editorial movement.
`,
};

const OUTPUT_DIRECTION: Record<
  string,
  string
> = {
  "instagram-post": `
Authentic luxury campaign framing with natural composition balance and premium editorial photography realism.
`,

  story: `
Vertical cinematic composition designed for immersive luxury fashion storytelling with natural editorial depth.
`,
};

const NEGATIVE_DIRECTION = `
Avoid poster layouts, influencer aesthetics, plastic skin, artificial posing, centered symmetry, graphic overlays, AI-looking rendering, flat lighting, or synthetic fashion styling.
`;

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

  return `
Create a cinematic luxury fashion campaign photograph using the uploaded hero image.

Maintain:
- exact garment realism
- embroidery accuracy
- fabric texture integrity
- silhouette accuracy
- facial identity realism

The result should feel like a real luxury fashion editorial photograph, not AI-generated artwork.

Visual direction:
- cinematic photographic realism
- natural editorial composition
- luxury fashion-magazine atmosphere
- believable environmental depth
- directional lighting
- subtle asymmetry
- restrained luxury emotion

Pose direction:
- confident editorial posture
- subtle natural movement
- relaxed couture body language
- avoid catalog stiffness

Composition:
- authentic photoshoot framing
- realistic lens behavior
- natural negative space
- slightly imperfect editorial balance

Lighting:
- subject brighter than environment
- sculpted facial lighting
- cinematic shadow falloff
- dimensional luxury atmosphere

${worldDirection}

${outputDirection}

${NEGATIVE_DIRECTION}
`;
}