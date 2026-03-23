/* =========================================================
   GARMENT DIFFICULTY CLASSIFIER — V1 (FIXED)
   ========================================================= */

export interface GarmentMeta {
  category: string;
  hasFlare?: boolean;
  asymmetricHem?: boolean;
  sleeveless?: boolean;
  ethnic?: boolean;
}

export function classifyGarmentDifficulty(
  meta: GarmentMeta
): "easy" | "medium" | "hard" {
  if (meta.asymmetricHem || meta.hasFlare) {
    return "hard";
  }

  if (meta.ethnic || meta.sleeveless) {
    return "medium";
  }

  return "easy";
}
