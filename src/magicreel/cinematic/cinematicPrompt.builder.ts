import { ResolvedCinematicWorld } from "./cinematicWorld.registry";

export interface CinematicPromptInput {
  world: ResolvedCinematicWorld;

  brandName?: string;
}

/* ------------------------------------------------------- */

function join(values: string[]) {
  return values.join(", ");
}

/* ------------------------------------------------------- */

function buildWorldAtmosphere(
  world: ResolvedCinematicWorld
) {
  switch (world.id) {
    case "dark-aristocracy":
      return `Shadowed architectural silence, sculptural palace light, restrained cinematic depth, and medium-format realism elevate the garment into the emotional center of the frame.`;

    case "garden-nostalgia":
      return `Soft monsoon air, diffused cinematic light, poetic stillness, and faded emotional warmth create an atmosphere of memory and romance.`;

    case "royal-solitude":
      return `Muted palace light, monumental emptiness, restrained composition, and emotional stillness create a feeling of regal isolation and timeless dignity.`;

    case "museum-couture":
      return `Curated stillness, sculptural gallery light, reverential composition, and tactile couture realism transform the garment into a timeless artifact.`;

    case "poetic-nature":
      return `Atmospheric haze, natural cinematic diffusion, environmental silence, and soft landscape depth dissolve the figure gently into emotion and nature.`;

    default:
      return `Restrained cinematic realism with emotional depth and editorial sophistication.`;
  }
}

/* ------------------------------------------------------- */

function buildEditorialPoseDirection(
  world: ResolvedCinematicWorld
) {
  switch (world.id) {
    case "dark-aristocracy":
      return `The posture feels restrained and powerful with subtle forward motion, slight asymmetry, quiet body tension, and emotionally controlled cinematic presence.`;

    case "garden-nostalgia":
      return `The figure carries soft natural movement with gentle posture asymmetry, poetic stillness, and emotionally unposed realism.`;

    case "royal-solitude":
      return `The body language feels isolated, dignified, emotionally restrained, and captured in a quiet transitional moment rather than a posed stance.`;

    case "museum-couture":
      return `The posture remains sculptural and reverential with restrained movement, controlled stillness, and editorial elegance.`;

    case "poetic-nature":
      return `The movement feels soft, atmospheric, and observational with natural cinematic body language and restrained emotional motion.`;

    default:
      return `The posture should feel naturally editorial with restrained cinematic movement and believable fashion realism.`;
  }
}

/* ------------------------------------------------------- */

function buildEnding(world: ResolvedCinematicWorld) {
  switch (world.id) {
    case "dark-aristocracy":
      return `The image should feel timeless, powerful, restrained, emotionally silent, and photographed inside an aristocratic cinematic world.`;

    case "garden-nostalgia":
      return `The image should feel poetic, emotionally soft, nostalgic, and cinematically romantic.`;

    case "royal-solitude":
      return `The image should feel isolated, monumental, dignified, and emotionally restrained.`;

    case "museum-couture":
      return `The image should feel sculptural, curated, timeless, and reverential toward the garment.`;

    case "poetic-nature":
      return `The image should feel atmospheric, contemplative, cinematic, and emotionally immersed in nature.`;

    default:
      return `The image should feel cinematic, luxurious, emotionally restrained, and editorially believable.`;
  }
}

/* ------------------------------------------------------- */

export function buildCinematicPrompt({
  world,
  brandName,
}: CinematicPromptInput): string {
  const brandPrefix = brandName
    ? `${brandName} cinematic luxury fashion editorial.`
    : "Cinematic luxury fashion editorial.";

  const prompt = `
${brandPrefix}

4:5 vertical luxury editorial composition with full cinematic garment framing, balanced negative space, and photographic fashion realism.

Photographed inside ${world.selectedArchitecture}.

${world.emotionalCore}

${buildWorldAtmosphere(world)}

${world.visualNarrative}

${buildEditorialPoseDirection(world)}

Preserve facial identity, skin tone, hairstyle, body proportions, garment embroidery, fabric texture, silhouette, fit, styling, and all fashion details exactly as provided.

Luxury atmosphere guided by ${join(world.luxuryCodes)} with color psychology inspired by ${join(world.colorPsychology)}.

Avoid artificial glamour, exaggerated motion, influencer aesthetics, commercial fashion energy, oversaturated styling, and synthetic AI beauty treatment.

${buildEnding(world)}
`;

  return prompt
    .replace(/\s+/g, " ")
    .trim();
}