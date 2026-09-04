import { LookbookWorldDefinition } from "./lookbookWorldRegistry";

export const ECOM_CLEAN_WORLD: LookbookWorldDefinition = {
  id: "ecom-clean",
  name: "Ecom Clean",
  description:
    "Marketplace-ready clean product presentation where the garment remains the unmistakable commercial focus.",
  environment:
    "Seamless pure-white to near-white studio background with no visible wall or floor transition, no props and no architectural elements.",
  lighting:
    "Soft, even, colour-accurate studio lighting with gentle natural grounding shadow and no dramatic colour cast.",
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
    "No dramatic coloured background or lighting cast.",
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
