"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePoses = void 0;
const path_1 = __importDefault(require("path"));
const poseGeneration_service_1 = require("./poseGeneration.service");
const generatePoses = async (req, res) => {
    try {
        const { heroImagePath } = req.body;
        if (!heroImagePath) {
            return res.status(400).json({
                success: false,
                error: "heroImagePath is required"
            });
        }
        const outputDir = path_1.default.join(process.cwd(), "src", "poses", "outputs", Date.now().toString());
        const generatedImages = await poseGeneration_service_1.poseGenerationService.generatePoses({
            heroImagePath,
            outputDir
        });
        return res.status(200).json({
            success: true,
            images: generatedImages
        });
    }
    catch (error) {
        console.error("Pose generation failed:", error.message || error);
        return res.status(500).json({
            success: false,
            error: "Pose generation failed"
        });
    }
};
exports.generatePoses = generatePoses;
