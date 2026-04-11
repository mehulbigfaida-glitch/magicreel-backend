"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHeroImage = generateHeroImage;
const path_1 = __importDefault(require("path"));
const heroFinalization_service_1 = require("../services/heroFinalization.service");
async function generateHeroImage(req, res) {
    try {
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({
                error: "JOB_ID_REQUIRED"
            });
        }
        const outputRoot = path_1.default.join(__dirname, "..", "outputs", jobId);
        (0, heroFinalization_service_1.finalizeHeroImage)({
            jobId,
            outputRoot,
            // Optional future params from View:
            // backgroundImagePath,
            // logoImagePath,
            // enhance
        });
        return res.json({
            success: true,
            heroFinalPath: `outputs/${jobId}/hero/hero_final.png`
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message || "HERO_FINALIZATION_FAILED"
        });
    }
}
