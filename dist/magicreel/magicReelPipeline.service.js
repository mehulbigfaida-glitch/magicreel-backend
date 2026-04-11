"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMagicReelJob = runMagicReelJob;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const klingVideo_service_1 = require("../video/services/klingVideo.service");
const cloudinaryVideoUpload_1 = require("../utils/cloudinaryVideoUpload");
async function runMagicReelJob(heroImagePath, outputBaseDir) {
    if (!fs_1.default.existsSync(heroImagePath)) {
        throw new Error("Hero image not found");
    }
    const clipsDir = path_1.default.join(outputBaseDir, "clips");
    fs_1.default.mkdirSync(clipsDir, { recursive: true });
    const outputVideoPath = path_1.default.join(clipsDir, "hero.mp4");
    console.log("🎥 Generating Hero video via Kling 2.1...");
    await klingVideo_service_1.klingVideoService.generateClip({
        imagePath: heroImagePath,
        outputVideoPath,
    });
    console.log("☁️ Uploading video to Cloudinary...");
    const videoUrl = await (0, cloudinaryVideoUpload_1.uploadVideoToCloudinary)(outputVideoPath);
    console.log("✅ Cloudinary upload complete");
    return {
        status: "completed",
        videoPath: outputVideoPath,
        videoUrl,
    };
}
