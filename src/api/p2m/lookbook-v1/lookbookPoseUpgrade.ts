import { LookbookCategoryPosePlan, LookbookPoseDefinition } from "./lookbookPoseRegistry";

/**
 * Upgrades the legacy three-pose category plans to the six-pose Ecom Lookbook set.
 * Pose 6 is intentionally a close-in product-detail asset for the future Carousel Reel.
 */
export function getEcomLookbookPosePlan(
  plan: LookbookCategoryPosePlan
): LookbookCategoryPosePlan {
  const existing = plan.poses.slice(0, 3);

  const extra: LookbookPoseDefinition[] = [
    {
      id: "pose_4",
      prompt:
        "Distinct three-quarter full-body commercial pose. Shift the weight naturally to create a new silhouette while keeping the complete garment unobstructed. Use a different arm configuration from Poses 1-3."
    },
    {
      id: "pose_5",
      prompt:
        "Distinct elegant full-body commercial pose emphasizing garment drape and construction. Use a controlled torso angle and asymmetric arm placement that is clearly different from Poses 1-4. Keep the complete garment and footwear visible."
    },
    {
      id: "pose_6",
      prompt:
        "CLOSE-IN PRODUCT DETAIL ASSET. Create a premium close-in fashion detail photograph focused on the most commercially informative garment area such as neckline, collar, sleeve, embroidery, print, texture, closure, border or other distinctive construction. Preserve the exact garment and styling. Keep the model identity consistent. This is intentionally a detail composition and does not require full-body framing. Do not invent garment details."
    }
  ];

  return {
    ...plan,
    poses: [...existing, ...extra]
  };
}
