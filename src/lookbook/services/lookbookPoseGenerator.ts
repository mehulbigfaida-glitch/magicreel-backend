import { CATEGORY_POSE_MAP } from "../presets/categoryPoseMap";

export type LookbookPoseType =
  | "user_anchor"
  | "hero"
  | "angled"
  | "zoomed_hero"
  | "back"
  | "zoomed_back"
  | string; // for category fallbacks like side_profile, detail_zoom, etc.

export interface LookbookPoseSlot {
  slot: number;
  type: LookbookPoseType;
}

interface LookbookPoseGeneratorInput {
  category: string;
  hasBackImage: boolean;
  hasUserImage: boolean;
}

export function generateLookbookPosePlan(
  input: LookbookPoseGeneratorInput
): LookbookPoseSlot[] {
  const { category, hasBackImage, hasUserImage } = input;

  if (!hasUserImage) {
    throw new Error("LOOKBOOK_USER_IMAGE_REQUIRED");
  }

  const posePlan: LookbookPoseSlot[] = [];

  // Slot 0 — User uploaded anchor image
  posePlan.push({ slot: 0, type: "user_anchor" });

  // Slot 1 — Hero pose (same as Try-On hero)
  posePlan.push({ slot: 1, type: "hero" });

  // Slot 2 — Angled pose
  posePlan.push({ slot: 2, type: "angled" });

  // Slot 3 — Zoomed hero pose
  posePlan.push({ slot: 3, type: "zoomed_hero" });

  // Slot 4 & 5 — Conditional resolution
  if (hasBackImage) {
    posePlan.push({ slot: 4, type: "back" });
    posePlan.push({ slot: 5, type: "zoomed_back" });
  } else {
    const fallback =
      CATEGORY_POSE_MAP[category] || CATEGORY_POSE_MAP.DEFAULT;

    posePlan.push({ slot: 4, type: fallback[0] });
    posePlan.push({ slot: 5, type: fallback[1] });
  }

  // Safety check — engine invariant
  if (posePlan.length !== 6) {
    throw new Error("LOOKBOOK_POSE_PLAN_CORRUPTED");
  }

  return posePlan;
}
