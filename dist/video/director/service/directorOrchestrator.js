"use strict";
// src/video/director/service/directorOrchestrator.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orchestrateDirectorMode = void 0;
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const BASE_AUDIO_DIR = path_1.default.join(process.cwd(), 'storage', 'director');
const orchestrateDirectorMode = async (payload) => {
    const audioRes = await axios_1.default.post('http://localhost:5001/api/video/director/voice', {
        script: payload.script,
        voiceId: payload.voiceId,
        speed: payload.speed,
        language: payload.language,
        metadata: payload.metadata,
    });
    const jobId = audioRes.data?.data?.jobId;
    return { jobId };
};
exports.orchestrateDirectorMode = orchestrateDirectorMode;
