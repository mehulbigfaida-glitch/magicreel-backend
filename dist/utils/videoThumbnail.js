"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoDuration = getVideoDuration;
exports.generateVideoThumbnail = generateVideoThumbnail;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
/**
 * Get video duration using ffprobe
 */
async function getVideoDuration(filePath) {
    return new Promise((resolve) => {
        const ffprobe = (0, child_process_1.spawn)("ffprobe", [
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            filePath,
        ]);
        let output = "";
        let errorOutput = "";
        ffprobe.stdout.on("data", (data) => {
            output += data.toString();
        });
        ffprobe.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });
        ffprobe.on("close", (code) => {
            if (code !== 0) {
                console.warn("[ffprobe] Failed:", errorOutput.trim());
                return resolve(null);
            }
            const duration = parseFloat(output.trim());
            resolve(isNaN(duration) ? null : duration);
        });
        ffprobe.on("error", () => resolve(null));
    });
}
/**
 * Generate WebP thumbnail using smart timing
 */
async function generateVideoThumbnail(filePath) {
    const duration = await getVideoDuration(filePath);
    const ss = !duration || duration <= 0 ? 1.0 : duration < 2 ? 0.1 : 1.0;
    const tmpDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), "magicreel-thumb-"));
    const outPath = path_1.default.join(tmpDir, `thumb-${Date.now()}.webp`);
    const args = [
        "-y",
        "-ss",
        ss.toString(),
        "-i",
        filePath,
        "-vframes",
        "1",
        "-vf",
        "scale=480:-1",
        "-vcodec",
        "libwebp",
        outPath,
    ];
    await new Promise((resolve, reject) => {
        const ffmpeg = (0, child_process_1.spawn)("ffmpeg", args);
        ffmpeg.on("close", (code) => {
            code === 0
                ? resolve()
                : reject(new Error(`ffmpeg exited with code ${code}`));
        });
        ffmpeg.on("error", (err) => reject(err));
    });
    return outPath;
}
