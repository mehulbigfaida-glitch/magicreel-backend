"use strict";
// src/video/director/service/directorFinalAssembler.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFinalAssembleJob = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const ffmpegPath_1 = __importDefault(require("../../../utils/ffmpegPath"));
const STORAGE_DIR = path_1.default.join(process.cwd(), "storage", "director_video");
const ensureDir = async (dir) => {
    await fs_1.default.promises.mkdir(dir, { recursive: true });
};
const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, (err, _stdout, stderr) => {
            if (err) {
                console.error("FFMPEG ERROR:", stderr);
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
const processFinalAssembleJob = async (payload) => {
    const { jobId, sceneOutputsPath, finalAudioPath } = payload;
    // ✅ FIX: ffmpegPath is a value, not a function
    const ffmpeg = ffmpegPath_1.default.ffmpegPath;
    const jobFolder = path_1.default.join(STORAGE_DIR, jobId);
    await ensureDir(jobFolder);
    const raw = await fs_1.default.promises.readFile(sceneOutputsPath, "utf8");
    const scenes = JSON.parse(raw);
    const concatList = path_1.default.join(jobFolder, "scene_list.txt");
    const listContent = scenes
        .map((s) => `file '${s.videoPath.replace(/'/g, "'\\''")}'`)
        .join("\n");
    await fs_1.default.promises.writeFile(concatList, listContent, "utf8");
    const mergedScenes = path_1.default.join(jobFolder, "final_scenes.mp4");
    const finalOutput = path_1.default.join(jobFolder, "director_output.mp4");
    const cmdMergeScenes = `"${ffmpeg}" -y -f concat -safe 0 -i "${concatList}" -c copy "${mergedScenes}"`;
    await runCommand(cmdMergeScenes);
    const cmdOverlayAudio = `"${ffmpeg}" -y -i "${mergedScenes}" -i "${finalAudioPath}" ` +
        `-c:v copy -map 0:v:0 -map 1:a:0 -shortest "${finalOutput}"`;
    await runCommand(cmdOverlayAudio);
    return {
        jobId,
        finalVideoPath: finalOutput,
    };
};
exports.processFinalAssembleJob = processFinalAssembleJob;
