"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLookbookPrompt = buildLookbookPrompt;
/**
 * IMPORTANT RULES:
 * - User anchor NEVER generates a prompt (no AI generation)
 * - Back prompts ONLY for back / zoomed_back
 * - No rear-facing language allowed elsewhere
 * - All prompts must be SINGLE LINE
 */
function buildLookbookPrompt(input) {
    const { poseType, scenePrompt } = input;
    // --- User uploaded image ---
    if (poseType === "user_anchor") {
        // No generation prompt; image is normalized elsewhere
        return null;
    }
    // --- Canonical prompts ---
    switch (poseType) {
        case "hero":
            return `front-facing fashion lookbook photograph, full body, neutral stance, clear garment visibility, ${scenePrompt}`;
        case "angled":
            return `three-quarter angled fashion lookbook photograph, full body, natural stance, clear silhouette, ${scenePrompt}`;
        case "zoomed_hero":
            return `close-up fashion lookbook photograph, upper body focus, garment details clearly visible, ${scenePrompt}`;
        case "back":
            return `rear view fashion lookbook photograph, model facing away from camera, full back of garment visible, neutral stance, ${scenePrompt}`;
        case "zoomed_back":
            return `close-up rear view fashion lookbook photograph, back detailing of garment clearly visible, ${scenePrompt}`;
        // --- Category fallback prompts (SAFE ONLY) ---
        default:
            return buildCategoryFallbackPrompt(poseType, scenePrompt);
    }
}
/**
 * Category fallback prompts
 * NOTE:
 * - NO rear view language
 * - NO implied back visibility
 * - Safe even without back image
 */
function buildCategoryFallbackPrompt(poseType, scenePrompt) {
    switch (poseType) {
        case "side_profile":
            return `side profile fashion lookbook photograph, full body, natural stance, garment silhouette visible, ${scenePrompt}`;
        case "detail_zoom":
            return `close-up fashion lookbook photograph, fabric texture and craftsmanship focus, ${scenePrompt}`;
        case "collar_zoom":
            return `close-up fashion lookbook photograph, collar and neckline details visible, ${scenePrompt}`;
        case "neckline_zoom":
            return `close-up fashion lookbook photograph, neckline and upper garment details visible, ${scenePrompt}`;
        case "movement":
            return `fashion lookbook photograph with subtle walking motion, full body, natural fabric flow, ${scenePrompt}`;
        case "fabric_flow":
            return `fashion lookbook photograph emphasizing fabric drape and flow, natural stance, ${scenePrompt}`;
        case "waist_fit_zoom":
            return `close-up fashion lookbook photograph focusing on waist fit and tailoring, ${scenePrompt}`;
        case "leg_silhouette":
            return `fashion lookbook photograph highlighting leg silhouette and fit, natural stance, ${scenePrompt}`;
        case "pallu_detail":
            return `close-up fashion lookbook photograph focusing on saree pallu drape and details, ${scenePrompt}`;
        case "border_zoom":
            return `close-up fashion lookbook photograph highlighting saree border craftsmanship, ${scenePrompt}`;
        case "open_front":
            return `fashion lookbook photograph with open-front styling, full body, garment layering visible, ${scenePrompt}`;
        case "texture_zoom":
            return `close-up fashion lookbook photograph highlighting material texture and finish, ${scenePrompt}`;
        default:
            // Ultra-safe generic fallback
            return `fashion lookbook photograph, full body, neutral stance, clear garment visibility, ${scenePrompt}`;
    }
}
