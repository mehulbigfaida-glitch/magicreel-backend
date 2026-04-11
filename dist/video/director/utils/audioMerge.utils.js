"use strict";
// src/video/director/utils/audioMerge.utils.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatenateAudioFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const ffmpegPath_1 = __importDefault(require("../../../utils/ffmpegPath")); // ✔ default import
const concatenateAudioFiles = async (filePaths, outputPath) => {
    if (!filePaths.length) {
        throw new Error("No audio files provided for concatenation.");
    }
    const ffmpeg = (0, ffmpegPath_1.default)(); // ✔ correct usage
    const tempList = `${outputPath}.txt`;
    const listContent = filePaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
    await fs_1.default.promises.writeFile(tempList, listContent, 'utf8');
    const cmd = `"${ffmpeg}" -y -f concat -safe 0 -i "${tempList}" -acodec copy "${outputPath}"`;
    await new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, (err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
    await fs_1.default.promises.unlink(tempList).catch(() => { });
};
exports.concatenateAudioFiles = concatenateAudioFiles;
