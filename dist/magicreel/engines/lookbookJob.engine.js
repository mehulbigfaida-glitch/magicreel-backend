"use strict";
// src/magicreel/engines/lookbookJob.engine.ts
// 🔒 Lookbook Job Creator — v1.0 (NO EXECUTION)
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLookbookJob = void 0;
const lookbook_schema_1 = require("../schema/lookbook.schema");
const lookbookImage_engine_1 = require("./lookbookImage.engine");
/**
 * Creates a LookbookJob with multiple RenderJobs
 * - Expands preset → poses
 * - One RenderJob per pose
 * - NO execution
 */
const createLookbookJob = async (input) => {
    const { lookbookId, modelId, garmentId, presetId } = input;
    const poses = lookbook_schema_1.LOOKBOOK_PRESETS[presetId];
    if (!poses || poses.length === 0) {
        throw new Error(`Invalid lookbook preset: ${presetId}`);
    }
    const renderJobs = [];
    for (const pose of poses) {
        const job = await (0, lookbookImage_engine_1.createLookbookRenderJob)({
            lookbookId,
            modelId,
            garmentId,
            pose,
        });
        renderJobs.push(job);
    }
    const lookbookJob = {
        lookbookId,
        modelId,
        garmentId,
        presetId,
        poses,
        status: "created",
        renderJobs,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return lookbookJob;
};
exports.createLookbookJob = createLookbookJob;
