"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHeroV2 = generateHeroV2;
const prisma_1 = require("../../../magicreel/db/prisma");
const heroPrompt_1 = require("../../../magicreel/prompts/heroPrompt");
const billing_middleware_1 = require("../../../billing/billing.middleware");
async function generateHeroV2(req, res) {
    try {
        const { categoryKey, avatarGender, avatarFaceImageUrl, garmentFrontImageUrl, styling, avatarBackImageUrl, garmentBackImageUrl, lookbookId, } = req.body;
        /* =========================
           VALIDATION
        ========================= */
        if (!categoryKey ||
            !avatarGender ||
            !avatarFaceImageUrl ||
            !garmentFrontImageUrl ||
            !lookbookId) {
            return res.status(400).json({
                error: "Missing required hero inputs (including lookbookId)",
            });
        }
        /* =========================
           FRONT HERO
        ========================= */
        const frontPrompt = (0, heroPrompt_1.buildHeroPrompt)({
            categoryKey,
            avatarGender,
            styling,
        });
        const frontJob = await prisma_1.prisma.render.create({
            data: {
                pose: "hero",
                engine: "QWEN",
                modelImageUrl: avatarFaceImageUrl,
                garmentImageUrl: garmentFrontImageUrl,
                outputImageUrl: null,
                status: "queued",
                lookbookId: lookbookId,
                type: "HERO",
            },
        });
        const frontRunId = frontJob.id;
        /* =========================
           BACK HERO
        ========================= */
        let backRunId = null;
        if (avatarBackImageUrl && garmentBackImageUrl) {
            const backPrompt = (0, heroPrompt_1.buildHeroPrompt)({
                categoryKey: `${categoryKey}_BACK`,
                avatarGender,
                styling,
            });
            const backJob = await prisma_1.prisma.render.create({
                data: {
                    pose: "hero_back",
                    engine: "QWEN",
                    modelImageUrl: avatarBackImageUrl,
                    garmentImageUrl: garmentBackImageUrl,
                    outputImageUrl: null,
                    status: "queued",
                    lookbookId: lookbookId,
                    type: "HERO",
                },
            });
            backRunId = backJob.id;
        }
        /* =========================
           BILLING
        ========================= */
        try {
            await (0, billing_middleware_1.finalizeBilling)(req);
        }
        catch (e) {
            console.error("Billing failed AFTER success:", e);
        }
        return res.json({
            frontRunId,
            backRunId,
        });
    }
    catch (err) {
        console.error("HERO V2 ERROR:", err);
        return res.status(500).json({
            error: err.message || "Hero generation failed",
        });
    }
}
