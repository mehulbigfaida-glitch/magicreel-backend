"use strict";
// src/video/director/controller/directorFull.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDirectorFull = void 0;
const axios_1 = __importDefault(require("axios"));
const runDirectorFull = async (req, res) => {
    try {
        const { script, voiceId, speed, language } = req.body || {};
        if (!script) {
            return res.status(400).json({
                success: false,
                message: "Script is required",
            });
        }
        // 1) AUDIO
        const audioRes = await axios_1.default.post('http://localhost:5001/api/video/director/voice', { script, voiceId, speed, language });
        const voiceJobId = audioRes.data?.data?.jobId;
        // 2) WAIT FOR AUDIO JOB
        let audioReady = false;
        let audioFinalPath = '';
        let audioTimelinePath = '';
        let audioDurationMs = 0;
        while (!audioReady) {
            const statusRes = await axios_1.default.get(`http://localhost:5001/api/video/director/voice/status/${voiceJobId}`);
            const state = statusRes.data?.data?.status;
            const result = statusRes.data?.data?.result;
            if (state === 'completed' && result) {
                audioFinalPath = result.finalAudioPath;
                audioTimelinePath = result.audioTimelinePath;
                audioDurationMs = result.audioDurationMs;
                audioReady = true;
            }
            if (state === 'failed')
                break;
            await new Promise((r) => setTimeout(r, 1500));
        }
        if (!audioReady) {
            return res.status(500).json({
                success: false,
                message: "Audio job failed",
            });
        }
        // 3) UNIFIED TIMELINE
        const timelineRes = await axios_1.default.post('http://localhost:5001/api/video/director/timeline/unified', {
            jobId: voiceJobId,
            audioPath: audioFinalPath,
            durationMs: audioDurationMs,
        });
        const unifiedTimelinePath = timelineRes.data?.data?.unifiedTimelinePath;
        // 4) SCENE GENERATION
        const sceneRes = await axios_1.default.post('http://localhost:5001/api/video/director/scenes/generate', { jobId: voiceJobId, unifiedTimelinePath });
        const sceneJobId = sceneRes.data?.data?.jobId;
        let scenesReady = false;
        let sceneOutputsPath = '';
        while (!scenesReady) {
            const st = await axios_1.default.get(`http://localhost:5001/api/video/director/scenes/status/${sceneJobId}`);
            const state = st.data?.data?.status;
            const result = st.data?.data?.result;
            if (state === 'completed' && result) {
                sceneOutputsPath = result.sceneOutputsPath;
                scenesReady = true;
            }
            if (state === 'failed')
                break;
            await new Promise((r) => setTimeout(r, 1500));
        }
        if (!scenesReady) {
            return res.status(500).json({
                success: false,
                message: "Scene generation failed",
            });
        }
        // 5) FINAL ASSEMBLY
        const finalRes = await axios_1.default.post('http://localhost:5001/api/video/director/final/assemble', {
            jobId: voiceJobId,
            sceneOutputsPath,
            finalAudioPath: audioFinalPath, // ✔ FIXED HERE
        });
        const finalJobId = finalRes.data?.data?.jobId;
        let finalReady = false;
        let finalVideoPath = '';
        while (!finalReady) {
            const st = await axios_1.default.get(`http://localhost:5001/api/video/director/final/status/${finalJobId}`);
            const state = st.data?.data?.status;
            const result = st.data?.data?.result;
            if (state === 'completed' && result) {
                finalVideoPath = result.finalVideoPath;
                finalReady = true;
            }
            if (state === 'failed')
                break;
            await new Promise((r) => setTimeout(r, 1500));
        }
        if (!finalReady) {
            return res.status(500).json({
                success: false,
                message: "Final assembly failed",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Director full pipeline completed",
            data: {
                jobId: voiceJobId,
                finalVideoPath,
            },
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Director full pipeline error",
        });
    }
};
exports.runDirectorFull = runDirectorFull;
