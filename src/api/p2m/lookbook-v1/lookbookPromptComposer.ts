import {
  getLookbookCategoryPoses,
  LookbookPoseDefinition,
} from "./lookbookPoseRegistry";

import {
  getLookbookWorld,
} from "./lookbookWorldRegistry";

import {
  getEcomLookbookWorld,
} from "./ecomLookbookWorld";

export type LookbookShotType =
  | "front"
  | "back"
  | "pose";

export interface BuildLookbookPromptInput {
  category: string;
  gender: string;
  worldId: string;
  shotType: LookbookShotType;
  pose?: LookbookPoseDefinition;
}

export function buildLookbookPrompt(
  input: BuildLookbookPromptInput
): string {

  const {
    category,
    gender,
    worldId,
    shotType,
    pose,
  } = input;

  const world = getEcomLookbookWorld(
    worldId,
    getLookbookWorld(worldId)
  );

  if (!world) {
    throw new Error(`Unknown Lookbook World: ${worldId}`);
  }

  const categoryPosePlan =
    getLookbookCategoryPoses(category);

  if (!categoryPosePlan) {
    throw new Error(
      `No Lookbook pose plan for category: ${category}`
    );
  }

  if (shotType === "pose" && !pose) {
    throw new Error(
      "Pose definition required for pose generation."
    );
  }

  const genderLabel =
    gender.trim().toLowerCase().startsWith("m")
      ? "MEN'S"
      : gender.trim().toLowerCase().startsWith("f")
        ? "WOMEN'S"
        : "UNISEX";

  const sections: string[] = [];

  sections.push(`
The source image is the absolute visual reference for the model and garment.

Preserve the model identity, face, hairstyle, skin appearance, body proportions and anatomy exactly.

Preserve the garment as an immutable finished commercial fashion product.

Do not redesign, reinterpret, simplify, improve, tailor, split, merge or structurally modify the garment.

Preserve fabric, colour, texture, silhouette, construction, embroidery, prints, embellishments, branding, drape and all visible product details exactly.

The generated image must represent the same commercial fashion product shown in the source image.

NO UNREFERENCED GARMENT LAYERS OR ACCESSORIES — CRITICAL

Do not add any garment layer, scarf, stole, shawl, veil, dupatta, saree pallu, jacket, coat, belt, bag, jewellery or other accessory that is not visibly present in the source/reference image.

In particular, NEVER invent or add a dupatta. If the source image does not visibly contain a dupatta, the generated image must not contain a dupatta in any form.

The absence of an item in the source is authoritative: do not infer, assume or add culturally or stylistically typical garments or accessories merely because they are common for this category.

FOOTWEAR CONTINUITY — CRITICAL

Preserve the footwear shown in the source/reference image. Footwear is part of the complete commercial styling and must remain consistent across every Lookbook image unless the source image provides no footwear.

Never remove, replace, invent or change footwear. Never render the model barefoot when footwear is visible in the reference.
`.trim());

  sections.push(`
${genderLabel} GARMENT CATEGORY: ${category}

Apply the category-specific construction and presentation instructions encoded for this category.

Do not reinterpret the garment as another category.
`.trim());

  sections.push(`
LOOKBOOK WORLD: ${world.name}

${world.description}

ENVIRONMENT:
${world.environment}

LIGHTING:
${world.lighting}

COMPOSITION:
${world.composition}

STYLING:
${world.styling}

POSE DIRECTION:
${world.poseDirection}

ACCESSORY DIRECTION:
${world.accessoryDirection}

WORLD NEGATIVE RULES:
${world.negativeRules.map(
  item => `• ${item}`
).join("\n")}
`.trim());

  if (worldId.trim().toLowerCase() === "ecom-clean") {
    sections.push(`
ECOMMERCE COMPLIANCE — CRITICAL

Use a clean white or near-white seamless studio presentation suitable for commercial marketplace product imagery.

Keep the model and complete garment clearly separated from the background through natural tonal contrast and a subtle realistic grounding shadow.

Do not make the image look like a crude background-removal cutout or a product pasted onto white.

Maintain accurate garment colour and detail under neutral colour-balanced lighting.

Keep the complete model and footwear inside the frame for all full-body shots, with safe margin for downstream marketplace cropping.
`.trim());
  }

  if (shotType === "front") {
    sections.push(`
SHOT: LOOKBOOK FRONT

${categoryPosePlan.front}

Generate one single full-body fashion photograph.
Face the model directly toward the camera.
Keep the complete garment visible from head to toe.
`.trim());
  }

  if (shotType === "back") {
    sections.push(`
SHOT: LOOKBOOK BACK

${categoryPosePlan.back}

Generate one single full-body fashion photograph.
The model faces directly away from the camera.
Show the complete rear garment construction clearly.
`.trim());
  }

  if (shotType === "pose") {
    sections.push(`
SHOT: ${pose!.id.toUpperCase()}

${pose!.prompt}

Generate exactly the instructed pose.
Do not substitute a different pose.
Do not create multiple people.
Do not create a grid, collage or split composition.
`.trim());
  }

  sections.push(`
FINAL PHOTOGRAPHY REQUIREMENTS

Premium commercial fashion photography.
Realistic human anatomy.
Natural garment physics.
Realistic fabric behaviour.
Full model visible from head to toe unless the shot explicitly calls for a close-up/detail composition.
One person only.
No text.
No collage.
No split screen.
No duplicate person.
The garment remains the dominant visual subject.
Footwear must remain consistent with the source image whenever footwear is visible there.
`.trim());

  return sections
    .filter(Boolean)
    .join("\n\n");
}
