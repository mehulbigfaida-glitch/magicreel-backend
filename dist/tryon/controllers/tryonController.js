"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTryOn = void 0;
const TryOnService_1 = require("../services/TryOnService");
const tryOnService = new TryOnService_1.TryOnService();
const generateTryOn = async (req, res) => {
    try {
        const { modelImageUrl, garmentImageUrl } = req.body;
        if (!modelImageUrl || !garmentImageUrl) {
            return res.status(400).json({
                success: false,
                error: "modelImageUrl and garmentImageUrl are required"
            });
        }
        const result = await tryOnService.generateTryOn({
            modelImageUrl,
            garmentImageUrl
        });
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("❌ Try-on Controller Error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Try-on generation failed"
        });
    }
};
exports.generateTryOn = generateTryOn;
