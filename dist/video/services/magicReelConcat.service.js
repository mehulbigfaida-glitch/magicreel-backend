"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.magicReelConcatService = exports.MagicReelConcatService = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class MagicReelConcatService {
    async generateMagicReel(input) {
        const { clips, outputDir } = input;
        if (clips.length < 2) {
            throw new Error("At least 2 clips are required");
        }
        // Ensure output directory exists
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        const concatFilePath = path_1.default.join(outputDir, "concat.txt");
        const outputVideoPath = path_1.default.join(outputDir, "magicreel.mp4");
        // 1️⃣ Create concat.txt
        const concatFileContent = clips
            .map((clipPath) => `file '${clipPath.replace(/\\/g, "/")}'`)
            .join("\n");
        fs_1.default.writeFileSync(concatFilePath, concatFileContent);
        // 2️⃣ FFmpeg concat command
        const ffmpegCommand = `ffmpeg -y -f concat -safe 0 -i "${concatFilePath}" -c copy "${outputVideoPath}"`;
        // 3️⃣ Execute FFmpeg
        await new Promise((resolve, reject) => {
            (0, child_process_1.exec)(ffmpegCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error("FFmpeg error:", stderr);
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
        return outputVideoPath;
    }
}
exports.MagicReelConcatService = MagicReelConcatService;
exports.magicReelConcatService = new MagicReelConcatService();
