"use strict";
// src/video/director/service/director.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDirectorVoiceJob = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const audioEngine_utils_1 = require("../utils/audioEngine.utils");
const BASE_DIR = path_1.default.join(process.cwd(), 'storage', 'director');
const ensureDir = async (dir) => {
    await fs_1.default.promises.mkdir(dir, { recursive: true });
};
const processDirectorVoiceJob = async (jobId, payload) => {
    await ensureDir(BASE_DIR);
    const config = {
        voiceId: payload.voiceId || 'director_indian_female',
        speed: payload.speed || 1.0,
        language: payload.language || 'en',
        maxSegmentChars: 380,
    };
    let timeline = (0, audioEngine_utils_1.buildTimelineForScript)(jobId, payload.script, config);
    timeline = await (0, audioEngine_utils_1.generateRealAudioForTimeline)(BASE_DIR, timeline);
    const audioTimelinePath = await (0, audioEngine_utils_1.saveTimelineToDisk)(BASE_DIR, timeline);
    const jobFolder = path_1.default.dirname(audioTimelinePath);
    const finalAudioPath = path_1.default.join(jobFolder, 'final.mp3');
    return {
        audioTimelinePath,
        audioDir: jobFolder,
        finalAudioPath,
        audioDurationMs: timeline.totalDurationMs,
        segments: timeline.segments.map((seg) => ({
            id: seg.id,
            text: seg.text,
            startMs: seg.startMs,
            endMs: seg.endMs,
            approximateDurationMs: seg.approximateDurationMs,
            audioPath: seg.audioPath,
        })),
    };
};
exports.processDirectorVoiceJob = processDirectorVoiceJob;
