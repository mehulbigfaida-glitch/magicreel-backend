"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLookbookPosePlan = generateLookbookPosePlan;
const categoryPoseMap_1 = require("../presets/categoryPoseMap");
function generateLookbookPosePlan(input) {
    const { category, hasBackImage, hasUserImage } = input;
    if (!hasUserImage) {
        throw new Error("LOOKBOOK_USER_IMAGE_REQUIRED");
    }
    const posePlan = [];
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
    }
    else {
        const fallback = categoryPoseMap_1.CATEGORY_POSE_MAP[category] || categoryPoseMap_1.CATEGORY_POSE_MAP.DEFAULT;
        posePlan.push({ slot: 4, type: fallback[0] });
        posePlan.push({ slot: 5, type: fallback[1] });
    }
    // Safety check — engine invariant
    if (posePlan.length !== 6) {
        throw new Error("LOOKBOOK_POSE_PLAN_CORRUPTED");
    }
    return posePlan;
}
