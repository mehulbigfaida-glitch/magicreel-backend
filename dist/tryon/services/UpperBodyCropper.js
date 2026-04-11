"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpperBodyCropper = void 0;
const sharp_1 = __importDefault(require("sharp"));
class UpperBodyCropper {
    // Crops head → mid-thigh for model, neckline → waist for garment
    static async cropModel(input) {
        const img = (0, sharp_1.default)(input);
        const m = await img.metadata();
        const h = m.height ?? 0;
        // head → ~60% height
        const cropHeight = Math.floor(h * 0.6);
        return img.extract({
            left: 0,
            top: 0,
            width: m.width ?? 0,
            height: cropHeight
        }).png().toBuffer();
    }
    static async cropGarmentTop(input) {
        const img = (0, sharp_1.default)(input);
        const m = await img.metadata();
        const h = m.height ?? 0;
        // neckline → waist (~45%)
        const cropHeight = Math.floor(h * 0.45);
        return img.extract({
            left: 0,
            top: 0,
            width: m.width ?? 0,
            height: cropHeight
        }).png().toBuffer();
    }
}
exports.UpperBodyCropper = UpperBodyCropper;
