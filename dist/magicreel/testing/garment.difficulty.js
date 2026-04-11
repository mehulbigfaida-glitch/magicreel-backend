"use strict";
/* =========================================================
   GARMENT DIFFICULTY CLASSIFIER — V1 (FIXED)
   ========================================================= */
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyGarmentDifficulty = classifyGarmentDifficulty;
function classifyGarmentDifficulty(meta) {
    if (meta.asymmetricHem || meta.hasFlare) {
        return "hard";
    }
    if (meta.ethnic || meta.sleeveless) {
        return "medium";
    }
    return "easy";
}
