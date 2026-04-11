"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLookbook = runLookbook;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lookbookPoseGenerator_1 = require("../../lookbook/services/lookbookPoseGenerator");
const garment_validator_1 = require("../../lookbook/validation/garment.validator");
const lookbookImageService_1 = require("../../lookbook/services/lookbookImageService");
const lookbookSeal_service_1 = require("./lookbookSeal.service");
/**
 * AUTHORITATIVE LOOKBOOK ORCHESTRATOR
 */
async function runLookbook(input) {
    const { jobId, category, hasBackImage, anchorImagePath, outputRoot } = input;
    // --------------------------------------------------
    // 1. Hard gate — anchor image is mandatory
    // --------------------------------------------------
    if (!anchorImagePath || !fs_1.default.existsSync(anchorImagePath)) {
        throw new Error("LOOKBOOK_RUN_FAILED: ANCHOR_IMAGE_REQUIRED");
    }
    // --------------------------------------------------
    // 2. Pose plan (single source of truth)
    // --------------------------------------------------
    const posePlan = (0, lookbookPoseGenerator_1.generateLookbookPosePlan)({
        category,
        hasBackImage,
        hasUserImage: true
    });
    // --------------------------------------------------
    // 3. Validation
    // --------------------------------------------------
    (0, garment_validator_1.validateLookbookJob)({
        category,
        hasBackImage,
        anchorImagePath,
        posePlan
    });
    // --------------------------------------------------
    // 4. Persist anchor as slot 0 (user.png)
    // --------------------------------------------------
    (0, lookbookImageService_1.persistAnchorImage)({
        jobId,
        outputRoot,
        anchorImagePath
    });
    /**
     * NOTE:
     * Pose image generation (hero, angled, back, etc.)
     * already happens in existing workers.
     * We do NOT trigger generation here.
     */
    // --------------------------------------------------
    // 5. Normalize outputs into lookbook/
    // --------------------------------------------------
    normalizeLookbookOutputs({
        jobId,
        outputRoot,
        posePlan
    });
    // --------------------------------------------------
    // 6. Seal lookbook (final authority)
    // --------------------------------------------------
    (0, lookbookSeal_service_1.sealLookbook)(outputRoot);
}
/* ------------------------------------------------------------------ */
/* OUTPUT NORMALIZATION — LOCAL & AUTHORITATIVE                        */
/* ------------------------------------------------------------------ */
const POSE_FILENAME_MAP = {
    user_anchor: "user.png",
    hero: "hero.png",
    angled: "angled.png",
    zoomed_hero: "zoomed_hero.png",
    back: "back.png",
    zoomed_back: "zoomed_back.png",
    // category fallbacks
    side_profile: "side_profile.png",
    detail_zoom: "detail.png",
    collar_zoom: "collar.png",
    neckline_zoom: "neckline.png",
    movement: "movement.png",
    fabric_flow: "fabric_flow.png",
    waist_fit_zoom: "waist_fit.png",
    leg_silhouette: "leg_silhouette.png",
    pallu_detail: "pallu.png",
    border_zoom: "border.png",
    open_front: "open_front.png",
    texture_zoom: "texture.png"
};
function normalizeLookbookOutputs(input) {
    const { outputRoot, posePlan } = input;
    const lookbookDir = path_1.default.join(outputRoot, "lookbook");
    ensureDir(lookbookDir);
    for (const pose of posePlan) {
        const filename = POSE_FILENAME_MAP[pose.type];
        if (!filename) {
            throw new Error(`LOOKBOOK_OUTPUT_ERROR: NO_FILENAME_FOR_${pose.type}`);
        }
        // Legacy generation location
        const legacyPath = path_1.default.join(outputRoot, "poses", `look_${pose.slot + 1}.png`);
        const targetPath = path_1.default.join(lookbookDir, filename);
        // user.png already copied earlier
        if (pose.type === "user_anchor") {
            continue;
        }
        if (!fs_1.default.existsSync(legacyPath)) {
            throw new Error(`LOOKBOOK_OUTPUT_ERROR: MISSING_IMAGE_${pose.type}`);
        }
        fs_1.default.copyFileSync(legacyPath, targetPath);
    }
    writeManifest(lookbookDir, posePlan);
}
function writeManifest(lookbookDir, posePlan) {
    const manifest = {
        generatedAt: new Date().toISOString(),
        poses: posePlan.map(p => ({
            slot: p.slot,
            type: p.type,
            filename: POSE_FILENAME_MAP[p.type]
        }))
    };
    fs_1.default.writeFileSync(path_1.default.join(lookbookDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf-8");
}
function ensureDir(dir) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
