import {
  EditorialWorld,
  CampaignOutput,
} from "./editorialPromptEngine";

interface DraftPromptInput {
  editorialWorld: EditorialWorld;

  output: CampaignOutput;
}

const WORLD_DIRECTION: Record<
  string,
  string
> = {
  "dark-aristocracy": `
Old-money cinematic darkness with sculptural shadows, aristocratic silence, emotional restraint, luxury loneliness, museum-grade black environments.
`,

  "poetic-nature": `
Poetic cinematic storytelling with romantic environmental atmosphere, emotional softness, wind interaction, natural luxury light, dreamlike realism.
`,

  "museum-couture": `
Architectural luxury presentation with gallery realism, sculptural framing, spatial restraint, timeless exhibition atmosphere.
`,

  "noir-couture": `
Vintage monochrome cinematic fashion with psychological mystery, elegant darkness, shadow-heavy Vogue realism.
`,

  "heritage-romance": `
Heirloom couture storytelling with nostalgic romance, antique architecture, emotional softness, timeless luxury realism.
`,

  "runway-editorial": `
Fashion-week documentary realism with cinematic runway energy, backstage atmosphere, editorial movement, modern Vogue styling.
`,

  "urban-luxury-cinema": `
Modern luxury nightlife realism with reflective city environments, cinematic fashion atmosphere, Gucci-inspired emotional surrealism.
`,
};

const OUTPUT_DIRECTION: Record<
  string,
  string
> = {
  "instagram-post": `
Luxury editorial Instagram framing with cinematic composition and premium visual hierarchy.
`,

  story: `
Vertical fashion-film storytelling optimized for cinematic mobile viewing.
`,
};

export function buildEditorialDraftPrompt(
  input: DraftPromptInput
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
CINEMATIC FASHION EDITORIAL.

Preserve:
- garment identity
- embroidery
- silhouette
- textile realism
- model identity

Reinterpret:
- pose
- body language
- framing
- cinematic composition
- environmental interaction

Generate:
- cinematic posture
- editorial walking behavior
- asymmetrical framing
- emotional storytelling
- fashion-film realism
- premium campaign atmosphere

Avoid:
- mannequin posing
- catalog posture
- influencer aesthetics
- AI symmetry
- static compositions

${worldDirection}

${outputDirection}
`;
}