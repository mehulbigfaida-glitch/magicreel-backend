import { LookbookWorldDefinition } from "./lookbookWorldRegistry";

export const ECOM_CLEAN_WORLD: LookbookWorldDefinition = {
  id: "ecom-clean",
  name: "Ecom Clean",
  description:
    "Marketplace-ready clean product presentation where the garment remains the unmistakable commercial focus.",
  environment:
    "Seamless pure white (#FFFFFF) studio background filling the entire frame, with no visible wall or floor transition, no props and no architectural elements. Keep the background visually white rather than grey or tinted.",
  lighting:
    "Soft, even, colour-accurate studio lighting with a subtle natural grounding shadow beneath the model and no dramatic colour cast. Keep the background white while preserving realistic garment texture and colour.",
  composition:
    "Clean, balanced product framing with the model fully visible and sufficient breathing room for safe marketplace cropping. Keep the garment prominent without crude cutout or pasted-on appearance.",
  styling:
    "Minimal commercial styling that supports the exact source garment. Preserve the source footwear and all important product details.",
  poseDirection:
    "Controlled, natural full-body commercial poses that clearly communicate garment fit, silhouette and construction without theatrical movement.",
  accessoryDirection:
    "Do not introduce distracting props or unnecessary accessories. Preserve source styling unless a restrained accessory is already part of the reference presentation.",
  negativeRules: [
    "No visible wall or floor horizon line.",
    "No props, furniture, architecture or decorative objects.",
    "No grey, cream, off-white, tinted, gradient or textured background; use pure white (#FFFFFF).",
    "No dramatic coloured lighting cast.",
    "No heavy shadows or floating/cutout appearance.",
    "No text, watermark, border, collage or split composition.",
    "Do not crop out the garment or footwear when they are visible in the source."
  ]
};

export function getEcomLookbookWorld(
  worldId: string,
  fallback: LookbookWorldDefinition | null
): LookbookWorldDefinition | null {
  if (worldId.trim().toLowerCase() === "ecom-clean") {
    return ECOM_CLEAN_WORLD;
  }

  return fallback;
}
