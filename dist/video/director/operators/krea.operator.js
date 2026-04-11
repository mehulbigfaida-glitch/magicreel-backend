"use strict";
// src/video/director/operators/krea.operator.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kreaOperator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promptEngine_utils_1 = require("../utils/promptEngine.utils");
exports.kreaOperator = {
    id: 'krea',
    label: 'KREA AI Operator',
    async generate(input) {
        const jobFolder = path_1.default.join(process.cwd(), 'storage', 'director_video', input.jobId);
        await fs_1.default.promises.mkdir(jobFolder, { recursive: true });
        const sceneMeta = input.metadata || {};
        const camera = sceneMeta.camera || null;
        const cameraPromptPart = camera?.promptSnippet || 'smooth cinematic camera movement';
        const prompt = (0, promptEngine_utils_1.buildDirectorPrompt)({
            preset: input.preset,
            durationMs: input.durationMs,
            cameraPrompt: cameraPromptPart,
            tone: 'runway',
            styleTags: ['neon accents', 'vogue editorial', 'soft bloom highlight'],
            extraDetails: 'model focus, garment details always clear, no motion blur on subject',
        });
        const filePath = path_1.default.join(jobFolder, `${input.sceneId}_krea.mp4`);
        await fs_1.default.promises.writeFile(filePath, Buffer.alloc(10));
        await fs_1.default.promises.writeFile(path_1.default.join(jobFolder, `${input.sceneId}_krea_prompt.txt`), prompt, 'utf8');
        return {
            sceneId: input.sceneId,
            videoPath: filePath,
            durationMs: input.durationMs,
        };
    },
};
