"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLookbookController = generateLookbookController;
const p2m_service_1 = require("../p2m/p2m.service");
const p2mService = new p2m_service_1.P2MService();
async function generateLookbookController(req, res) {
    console.log("🚨 RAW REQUEST BODY", JSON.stringify(req.body, null, 2));
    try {
        const { category, // 🔴 UI-selected category (SOURCE OF TRUTH)
        avatarGender, garmentImageUrl, modelImageUrl, attributes, } = req.body;
        if (!category) {
            return res.status(400).json({ error: "category required" });
        }
        if (!avatarGender) {
            return res.status(400).json({ error: "avatarGender required" });
        }
        if (!garmentImageUrl || !modelImageUrl) {
            return res.status(400).json({ error: "images required" });
        }
        // 🔥 FORCE UI CATEGORY — NO DB OVERRIDE
        const effectiveCategory = category;
        console.log("[LOOKBOOK GENERATE]", {
            effectiveCategory,
            avatarGender,
        });
        const result = await p2mService.run({
            category: effectiveCategory, // ✅ ALWAYS UI CATEGORY
            avatarGender,
            productImageUrl: garmentImageUrl,
            modelImageUrl,
            attributes,
        });
        if (result?.mode === "PROMPT_ONLY") {
            return res.json(result);
        }
        return res.json({
            status: "submitted",
            jobId: result.jobId,
        });
    }
    catch (err) {
        console.error("❌ LOOKBOOK GENERATION FAILED:", err.message);
        return res.status(500).json({ error: err.message });
    }
}
