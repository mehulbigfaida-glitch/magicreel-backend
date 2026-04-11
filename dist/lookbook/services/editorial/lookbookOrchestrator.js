"use strict";
// src/lookbook/services/editorial/lookbookOrchestrator.ts
// 🔒 Lookbook Orchestrator — Generation + Editorial (v1.0)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLookbookOrchestrator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lookbookPdfService_1 = require("../lookbookPdfService");
const lookbookVideoService_1 = require("../lookbookVideoService");
const lookbookJob_engine_1 = require("../../../magicreel/engines/lookbookJob.engine");
const renderJobExecutor_service_1 = require("../../../magicreel/services/renderJobExecutor.service");
/* ------------------------------------------------------------------
   MAIN ORCHESTRATOR — v1.0
------------------------------------------------------------------ */
const runLookbookOrchestrator = async (payload) => {
    const { lookbookId = `lookbook_${Date.now()}`, modelId = "riya", garmentId, presetId = "ecommerce_standard", title = "Lookbook", metadata, } = payload;
    if (!garmentId) {
        throw new Error("garmentId is required for lookbook generation");
    }
    /* ---------------------------------------------------------
       1️⃣ Create LookbookJob (NO EXECUTION)
       --------------------------------------------------------- */
    const lookbookJob = await (0, lookbookJob_engine_1.createLookbookJob)({
        lookbookId,
        modelId,
        garmentId,
        presetId,
    });
    /* ---------------------------------------------------------
       2️⃣ Execute RenderJobs sequentially
       --------------------------------------------------------- */
    const generatedImages = [];
    for (const job of lookbookJob.renderJobs) {
        const completedJob = await (0, renderJobExecutor_service_1.executeRenderJob)(job);
        if (completedJob.status !== "completed" || !completedJob.outputImageUrl) {
            throw new Error(`Render failed for pose: ${job.pose}`);
        }
        generatedImages.push(completedJob.outputImageUrl);
    }
    /* ---------------------------------------------------------
       3️⃣ Editorial Outputs (PDF / Video)
       --------------------------------------------------------- */
    const baseDir = path_1.default.join(process.cwd(), "storage", "lookbook", lookbookId);
    await fs_1.default.promises.mkdir(baseDir, { recursive: true });
    const pdfPath = await (0, lookbookPdfService_1.generateLookbookPdf)(lookbookId, generatedImages, presetId, title);
    const videoPath = await (0, lookbookVideoService_1.generateLookbookVideo)(lookbookId, generatedImages, presetId, metadata);
    /* ---------------------------------------------------------
       4️⃣ Return
       --------------------------------------------------------- */
    return {
        lookbookId,
        images: generatedImages,
        pdfPath,
        videoPath,
    };
};
exports.runLookbookOrchestrator = runLookbookOrchestrator;
