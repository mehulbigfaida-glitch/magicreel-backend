/* =========================================================
   GARMENT & OUTPUT VALIDATION — V1
   Hard-garment safety checks
   ========================================================= */

export type GarmentDifficulty =
  | "easy"
  | "medium"
  | "hard";

export interface ValidationResult {
  passed: boolean;
  reasons: string[];
}

export interface ValidationContext {
  frontImageUrl: string;
  currentImageUrl: string;
  pose: "front" | "three_quarter" | "side" | "back";
  difficulty: GarmentDifficulty;
}

/* ---------------------------------------------------------
   NOTE:
   Image analysis is stubbed for V1.
   Hooks are placed for CV / ML later.
   --------------------------------------------------------- */

export function validateTryOn(
  ctx: ValidationContext
): ValidationResult {
  const reasons: string[] = [];

  // Hard rules (pose-independent)
  if (!ctx.currentImageUrl) {
    reasons.push("Missing output image");
  }

  // Pose-specific guards
  if (ctx.pose === "side" || ctx.pose === "back") {
    if (ctx.difficulty === "hard") {
      // stricter validation for difficult garments
      reasons.push("Hard garment: inferred pose requires caution");
    }
  }

  // Difficulty-based logic
  if (ctx.difficulty === "hard" && ctx.pose !== "front") {
    // For V1, we allow but flag
    // In future, can enforce real back upload
  }

  return {
    passed: reasons.length === 0,
    reasons,
  };
}
