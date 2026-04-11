"use strict";
// src/video/director/utils/directorTimelineBuilder.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUnifiedTimeline = exports.buildUnifiedTimeline = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cameraMovementEngine_1 = require("./cameraMovementEngine");
const PRESET_SEQUENCE = [
    'studio_cyclorama',
    'street_neon_runway',
    'mirror_vogue',
    'studio_cyclorama',
    'vogue_moodboard',
    'street_neon_runway',
];
const buildUnifiedTimeline = async (jobId, audioFinalPath, audioTotalDurationMs) => {
    const totalScenes = Math.min(6, Math.max(3, Math.floor(audioTotalDurationMs / 3500)));
    const sceneDuration = Math.floor(audioTotalDurationMs / totalScenes);
    let scenes = [];
    let cursor = 0;
    for (let i = 0; i < totalScenes; i++) {
        const preset = PRESET_SEQUENCE[i % PRESET_SEQUENCE.length];
        const startMs = cursor;
        const endMs = i === totalScenes - 1 ? audioTotalDurationMs : cursor + sceneDuration;
        const camera = (0, cameraMovementEngine_1.buildCameraInstruction)({
            preset,
            sceneIndex: i,
            totalScenes,
            durationMs: endMs - startMs,
        });
        scenes.push({
            id: `scene-${i + 1}`,
            index: i,
            type: 'scene',
            preset,
            startMs,
            endMs,
            durationMs: endMs - startMs,
            camera,
        });
        cursor = endMs;
    }
    const audioBlock = {
        type: 'audio',
        file: audioFinalPath,
        startMs: 0,
        endMs: audioTotalDurationMs,
    };
    return {
        jobId,
        audio: audioBlock,
        scenes,
        durationMs: audioTotalDurationMs,
        createdAt: new Date().toISOString(),
    };
};
exports.buildUnifiedTimeline = buildUnifiedTimeline;
const saveUnifiedTimeline = async (jobId, baseDir, timeline) => {
    const folder = path_1.default.join(baseDir, jobId);
    await fs_1.default.promises.mkdir(folder, { recursive: true });
    const filePath = path_1.default.join(folder, 'unified_timeline.json');
    await fs_1.default.promises.writeFile(filePath, JSON.stringify(timeline, null, 2), 'utf8');
    return filePath;
};
exports.saveUnifiedTimeline = saveUnifiedTimeline;
