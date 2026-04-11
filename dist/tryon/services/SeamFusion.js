"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeamFusion = void 0;
const sharp_1 = __importDefault(require("sharp"));
class SeamFusion {
    static async fuse(upper, lower) {
        const upperImg = (0, sharp_1.default)(upper);
        const u = await upperImg.metadata();
        const l = await (0, sharp_1.default)(lower).metadata();
        const width = Math.max(u.width ?? 0, l.width ?? 0);
        const upperResized = await upperImg.resize(width).png().toBuffer();
        const lowerResized = await (0, sharp_1.default)(lower).resize(width).png().toBuffer();
        return (0, sharp_1.default)({
            create: {
                width,
                height: (u.height ?? 0) + (l.height ?? 0),
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .composite([
            { input: upperResized, top: 0, left: 0 },
            { input: lowerResized, top: u.height ?? 0, left: 0 }
        ])
            .png()
            .toBuffer();
    }
}
exports.SeamFusion = SeamFusion;
