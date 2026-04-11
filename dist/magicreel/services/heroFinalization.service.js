"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeHeroImage = finalizeHeroImage;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * FINALIZE HERO IMAGE
 * - No AI
 * - Deterministic
 * - Produces hero_final.png
 */
function finalizeHeroImage(input) {
    const { jobId, outputRoot, backgroundImagePath, logoImagePath, enhance } = input;
    const tryonHeroPath = path_1.default.join(outputRoot, "tryon", "hero_base.png");
    if (!fs_1.default.existsSync(tryonHeroPath)) {
        throw new Error("HERO_FINALIZATION_FAILED: HERO_BASE_NOT_FOUND");
    }
    const heroDir = path_1.default.join(outputRoot, "hero");
    ensureDir(heroDir);
    const finalHeroPath = path_1.default.join(heroDir, "hero_final.png");
    /**
     * v1 IMPLEMENTATION:
     * For now, we simply copy the hero base.
     * Background / logo / enhance hooks are ready
     * but do not mutate image yet.
     *
     * This keeps behavior safe and predictable.
     */
    fs_1.default.copyFileSync(tryonHeroPath, finalHeroPath);
    /**
     * Future-safe hooks (NO-OP in v1):
     * - applyBackground()
     * - applyLogo()
     * - applyEnhancement()
     */
}
function ensureDir(dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
