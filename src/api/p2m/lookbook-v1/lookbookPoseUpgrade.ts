import { LookbookCategoryPosePlan, LookbookPoseDefinition } from "./lookbookPoseRegistry";

/**
 * Ecom Lookbook V1 is intentionally a 6-image pack when both Hero references
 * are available: Front + Back + the category's 3 existing poses + 1 close-in
 * product-detail asset.
 *
 * Do not add additional full-body poses here. The close-in asset is the only
 * new pose introduced by the Ecom upgrade.
 */
export function getEcomLookbookPosePlan(
  plan: LookbookCategoryPosePlan
): LookbookCategoryPosePlan {
  const existing = plan.poses.slice(0, 3);

  const closeIn: LookbookPoseDefinition = {
    id: "pose_4",
    prompt:
      "CLOSE-IN PRODUCT DETAIL ASSET — Create a premium close-in fashion detail photograph focused tightly on the garment's most commercially important visible construction/detail. Preserve the exact garment material, colour, texture, stitching, buttons, embroidery, print, weave, hardware and finishing shown in the source. Keep the same model identity where visible. Do not invent or alter product details. Do not introduce a different garment or accessory. This is intentionally not a full-body image.",
  };

  return {
    ...plan,
    poses: [...existing, closeIn],
  };
}
