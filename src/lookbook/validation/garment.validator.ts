import fs from "fs";
import { LookbookPoseSlot } from "../services/lookbookPoseGenerator";

interface LookbookValidationInput {
  category: string;
  hasBackImage: boolean;
  anchorImagePath: string;
  posePlan: LookbookPoseSlot[];
}

export function validateLookbookJob(input: LookbookValidationInput): void {
  const { category, hasBackImage, anchorImagePath, posePlan } = input;

  // --- Anchor is mandatory ---
  if (!anchorImagePath || !fs.existsSync(anchorImagePath)) {
    throw new Error("LOOKBOOK_VALIDATION_FAILED: ANCHOR_IMAGE_REQUIRED");
  }

  if (!posePlan || posePlan.length !== 6) {
    throw new Error("LOOKBOOK_VALIDATION_FAILED: INVALID_POSE_PLAN_LENGTH");
  }

  // --- Slot integrity ---
  const slots = new Set(posePlan.map(p => p.slot));
  if (slots.size !== 6) {
    throw new Error("LOOKBOOK_VALIDATION_FAILED: SLOT_CORRUPTION");
  }

  // --- Back enforcement ---
  const hasBackPose = posePlan.some(
    p => p.type === "back" || p.type === "zoomed_back"
  );

  if (hasBackImage && !hasBackPose) {
    throw new Error("LOOKBOOK_VALIDATION_FAILED: BACK_REQUIRED");
  }

  if (!hasBackImage && hasBackPose) {
    throw new Error("LOOKBOOK_VALIDATION_FAILED: FAKE_BACK_DETECTED");
  }

  // --- Mandatory commercial poses ---
  ["hero", "angled", "zoomed_hero"].forEach(pose => {
    if (!posePlan.some(p => p.type === pose)) {
      throw new Error(`LOOKBOOK_VALIDATION_FAILED: MISSING_${pose}`);
    }
  });

  if (!category) {
    throw new Error("LOOKBOOK_VALIDATION_FAILED: CATEGORY_REQUIRED");
  }
}
