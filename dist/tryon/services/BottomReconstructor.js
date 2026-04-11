"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomReconstructor = void 0;
const sharp_1 = __importDefault(require("sharp"));
class BottomReconstructor {
    // Scales original skirt so waist matches bodice waist
    static async reconstruct(originalGarment, targetWaistPx) {
        const img = (0, sharp_1.default)(originalGarment);
        const m = await img.metadata();
        const origWidth = m.width ?? 1;
        const scale = targetWaistPx / origWidth;
        return img
            .resize(Math.round(origWidth * scale))
            .png()
            .toBuffer();
    }
}
exports.BottomReconstructor = BottomReconstructor;
