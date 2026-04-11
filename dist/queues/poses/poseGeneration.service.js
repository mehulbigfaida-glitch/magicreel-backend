"use strict";
// src/queues/poses/poseGeneration.service.ts
// FINAL – SINGLE SOURCE OF TRUTH
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poseGenerationService = exports.PoseGenerationService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const posePresets_1 = require("./posePresets");
class PoseGenerationService {
    async generatePoses(input) {
        const { heroImagePath, outputDir } = input;
        if (!fs_1.default.existsSync(heroImagePath)) {
            throw new Error("Hero image not found");
        }
        fs_1.default.mkdirSync(outputDir, { recursive: true });
        const image = (0, sharp_1.default)(heroImagePath);
        const metadata = await image.metadata();
        if (!metadata.width || !metadata.height) {
            throw new Error("Invalid hero image");
        }
        const width = metadata.width;
        const height = metadata.height;
        const generatedImages = [];
        for (const preset of posePresets_1.POSE_PRESETS) {
            const outputPath = path_1.default.join(outputDir, preset.outputFileName);
            let extractOptions = {
                left: 0,
                top: 0,
                width,
                height,
            };
            switch (preset.type) {
                case "FRONT":
                    extractOptions = {
                        left: Math.floor(width * 0.05),
                        top: Math.floor(height * 0.02),
                        width: Math.floor(width * 0.9),
                        height: Math.floor(height * 0.96),
                    };
                    break;
                case "THREE_QUARTER":
                    extractOptions = {
                        left: Math.floor(width * 0.15),
                        top: Math.floor(height * 0.05),
                        width: Math.floor(width * 0.8),
                        height: Math.floor(height * 0.9),
                    };
                    break;
                case "WALK":
                    extractOptions = {
                        left: Math.floor(width * 0.02),
                        top: Math.floor(height * 0.08),
                        width: Math.floor(width * 0.88),
                        height: Math.floor(height * 0.92),
                    };
                    break;
            }
            await (0, sharp_1.default)(heroImagePath)
                .extract(extractOptions)
                .resize(1080, 1920, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255 },
            })
                .toFile(outputPath);
            generatedImages.push(outputPath);
        }
        return generatedImages;
    }
}
exports.PoseGenerationService = PoseGenerationService;
exports.poseGenerationService = new PoseGenerationService();
