"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToVideoClipService = exports.ImageToVideoClipService = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ImageToVideoClipService {
    async generateClip(input) {
        const { imagePath, outputVideoPath } = input;
        const duration = input.durationSeconds ?? 2;
        if (!fs_1.default.existsSync(imagePath)) {
            throw new Error(`Image not found: ${imagePath}`);
        }
        const outputDir = path_1.default.dirname(outputVideoPath);
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        // IMPORTANT:
        // Windows-safe, single-line FFmpeg command
        const ffmpegCommand = `ffmpeg -y -loop 1 -i "${imagePath}" ` +
            `-vf zoompan=z=1.001:d=${duration * 30}:s=1080x1920 ` +
            `-t ${duration} -r 30 -pix_fmt yuv420p "${outputVideoPath}"`;
        await new Promise((resolve, reject) => {
            (0, child_process_1.exec)(ffmpegCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error("FFmpeg image→video error:", stderr || error.message);
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.ImageToVideoClipService = ImageToVideoClipService;
exports.imageToVideoClipService = new ImageToVideoClipService();
