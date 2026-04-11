"use strict";
/* =========================================================
   MAGICREEL BACKEND JOB SCHEMA — V1
   Authoritative system backbone
   ========================================================= */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_LOOKBOOK_TRANSITIONS = exports.VALID_RENDER_TRANSITIONS = exports.MODELS = exports.LOOKBOOK_PRESETS = void 0;
/* =========================================================
   PRESET DEFINITIONS
   ========================================================= */
exports.LOOKBOOK_PRESETS = {
    ecommerce_standard: ["front", "three_quarter", "side", "back"],
    quick_catalog: ["front", "three_quarter"],
    social_reel: ["three_quarter", "side", "front"],
    ethnic_pro: ["front", "three_quarter", "side", "back"],
};
/* =========================================================
   MODEL REGISTRY (V1)
   ========================================================= */
exports.MODELS = {
    riya: {
        modelId: "riya",
        displayName: "Riya",
        basePoseImages: {
            front: "MODEL_FRONT_BASE_URL",
            three_quarter: "MODEL_THREE_QUARTER_BASE_URL",
            side: "MODEL_SIDE_BASE_URL",
            back: "MODEL_BACK_BASE_URL",
        },
    },
};
/* =========================================================
   JOB STATE TRANSITIONS (GUARDED)
   ========================================================= */
exports.VALID_RENDER_TRANSITIONS = {
    pending: ["running", "skipped"],
    running: ["completed", "failed"],
    completed: [],
    failed: [],
    skipped: [],
};
exports.VALID_LOOKBOOK_TRANSITIONS = {
    created: ["processing"],
    processing: ["completed", "partial", "failed"],
    completed: [],
    partial: [],
    failed: [],
};
