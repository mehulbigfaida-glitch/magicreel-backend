"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarmentIntelligence = void 0;
const sharp_1 = __importDefault(require("sharp"));
class GarmentIntelligence {
    static resolveGarmentProfile() {
        return {
            category: "one-pieces",
            garmentPhotoType: "flat-lay",
            segmentationFree: false
        };
    }
    static async padGarment(inputPath, outputPath) {
        const image = (0, sharp_1.default)(inputPath);
        const meta = await image.metadata();
        if (!meta.width || !meta.height) {
            throw new Error("Invalid garment image dimensions");
        }
        const bottomPadding = Math.floor(meta.height * 0.35);
        const sidePadding = Math.floor(meta.width * 0.15);
        await image
            .extend({
            top: 0,
            bottom: bottomPadding,
            left: sidePadding,
            right: sidePadding,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
            .png()
            .toFile(outputPath);
    }
}
exports.GarmentIntelligence = GarmentIntelligence;
