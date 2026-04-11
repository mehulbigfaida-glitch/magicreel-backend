"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeSealService = void 0;
const sharp_1 = __importDefault(require("sharp"));
class EdgeSealService {
    static async seal(buffer) {
        return (0, sharp_1.default)(buffer)
            .sharpen({ sigma: 0.25 })
            .trim({
            background: { r: 255, g: 255, b: 255, alpha: 0 },
            threshold: 2
        })
            .png()
            .toBuffer();
    }
}
exports.EdgeSealService = EdgeSealService;
