"use strict";
// src/magicreel/engines/lookbookImage.engine.ts
// 🔒 Lookbook Image Engine — RenderJob CREATION ONLY (v1.0)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLookbookRenderJob = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const lookbook_schema_1 = require("../schema/lookbook.schema");
const promptBuilder_1 = require("../prompts/promptBuilder");
/**
 * Create a RenderJob for Lookbook (NO EXECUTION)
 * - Binds locked prompt
 * - Resolves correct model image (front / back / pose-based)
 * - Sets initial job state
 */
const createLookbookRenderJob = async (input) => {
    const { lookbookId, modelId, garmentId, pose } = input;
    /* ---------------------------------------------------------
       1️⃣ Resolve Garment (DB)
       --------------------------------------------------------- */
    const garment = await prisma_1.default.garment.findUnique({
        where: { id: garmentId },
    });
    if (!garment) {
        throw new Error("Garment not found");
    }
    /* ---------------------------------------------------------
       2️⃣ Resolve Model from REGISTRY (LOCKED)
       --------------------------------------------------------- */
    const model = lookbook_schema_1.MODELS[modelId];
    if (!model) {
        throw new Error(`Model not registered: ${modelId}`);
    }
    const modelImageUrl = model.basePoseImages[pose];
    if (!modelImageUrl) {
        throw new Error(`Model image not available for pose: ${pose}`);
    }
    /* ---------------------------------------------------------
       3️⃣ Resolve Garment Image (Lookbook uses FRONT garment)
       --------------------------------------------------------- */
    const garmentImageUrl = garment.frontImageUrl;
    /* ---------------------------------------------------------
       4️⃣ Bind LOCKED Product-to-Model Prompt
       --------------------------------------------------------- */
    const prompt = (0, promptBuilder_1.buildP2MPrompt)({
        category: garment.category,
        avatarGender: "female",
        attributes: {},
    });
    /* ---------------------------------------------------------
       5️⃣ Create RenderJob (NO EXECUTION)
       --------------------------------------------------------- */
    const renderJob = {
        jobId: crypto.randomUUID(),
        lookbookId,
        pose,
        engine: "fashn",
        modelImageUrl,
        garmentImageUrl,
        prompt,
        status: "pending",
        retries: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return renderJob;
};
exports.createLookbookRenderJob = createLookbookRenderJob;
