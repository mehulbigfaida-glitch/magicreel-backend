"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHeroVideoV2 = generateHeroVideoV2;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const klingVideo_service_1 = require("../../video/services/klingVideo.service");
async function generateHeroVideoV2(heroImagePath, outputBaseDir) {
    if (!fs_1.default.existsSync(heroImagePath)) {
        throw new Error("Hero image not found");
    }
    const heroDir = path_1.default.join(outputBaseDir, "hero");
    fs_1.default.mkdirSync(heroDir, { recursive: true });
    const heroVideoPath = path_1.default.join(heroDir, "hero.mp4");
    await klingVideo_service_1.klingVideoService.generateClip({
        imagePath: heroImagePath,
        outputVideoPath: heroVideoPath,
    });
    if (!fs_1.default.existsSync(heroVideoPath)) {
        throw new Error("Hero video generation failed");
    }
    return heroVideoPath;
}
