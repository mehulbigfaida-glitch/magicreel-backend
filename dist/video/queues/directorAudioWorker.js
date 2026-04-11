"use strict";
// src/video/queues/directorAudioWorker.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const directorAudioQueue_1 = require("./directorAudioQueue");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const BASE_DIR = path_1.default.join(process.cwd(), "storage", "director");
// Ensure folder exists
if (!fs_1.default.existsSync(BASE_DIR))
    fs_1.default.mkdirSync(BASE_DIR, { recursive: true });
// ----------------------------
// WORKER PROCESSOR
// ----------------------------
directorAudioQueue_1.directorAudioQueue.process(async (job) => {
    const { script } = job.data;
    const jobFolder = path_1.default.join(BASE_DIR, String(job.id));
    if (!fs_1.default.existsSync(jobFolder))
        fs_1.default.mkdirSync(jobFolder, { recursive: true });
    // Fake 1-second processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const finalAudioPath = path_1.default.join(jobFolder, "final.mp3");
    const timelinePath = path_1.default.join(jobFolder, "timeline.json");
    // Stub audio (creates empty mp3 file)
    fs_1.default.writeFileSync(finalAudioPath, "");
    // Timeline JSON stub
    fs_1.default.writeFileSync(timelinePath, JSON.stringify({
        jobId: job.id,
        script,
        duration: 1,
        segments: [{ start: 0, end: 1 }],
    }));
    return {
        finalAudio: finalAudioPath,
        timeline: timelinePath,
    };
});
console.log("🎧 Director Audio Worker Ready");
