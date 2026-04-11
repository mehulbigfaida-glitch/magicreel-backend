"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReelV1Controller = generateReelV1Controller;
const reelV1_service_1 = require("../../../magicreel/services/reelV1.service");
const billing_middleware_1 = require("../../../billing/billing.middleware"); // ✅ FIX
const billing_middleware_2 = require("../../../billing/billing.middleware");
async function generateReelV1Controller(req, res) {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                error: "imageUrl is required",
            });
        }
        /* ----------------------------------
           GENERATE REEL
        ---------------------------------- */
        await (0, billing_middleware_2.checkCreditsOrThrow)(req, 3);
        const result = await reelV1_service_1.reelV1Service.generate({ imageUrl });
        // 🔥 attach referenceId
        req.billingMetadata = {
            referenceId: result.predictionId || null,
        };
        /* ----------------------------------
           ✅ BILLING (UNIFIED SYSTEM)
        ---------------------------------- */
        try {
            await (0, billing_middleware_1.finalizeBilling)(req); // ✅ SINGLE SOURCE
        }
        catch (e) {
            console.error("Reel billing failed:", e);
            // do not block response
        }
        return res.status(200).json({
            success: true,
            reelVideoUrl: result.reelVideoUrl,
        });
    }
    catch (error) {
        console.error("❌ Reel V1 Error:", error);
        if (error.code === "INSUFFICIENT_CREDITS") {
            return res.status(400).json({
                success: false,
                error: "INSUFFICIENT_CREDITS",
                required: error.required,
                available: error.available,
            });
        }
        return res.status(500).json({
            success: false,
            error: error.message || "Reel generation failed",
        });
    }
}
