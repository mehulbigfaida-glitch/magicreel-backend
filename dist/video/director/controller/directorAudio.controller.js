"use strict";
// src/video/director/controller/directorAudio.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFinalAudio = exports.getFinalVoiceAssets = exports.getVoiceJobStatus = exports.createVoiceJob = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const directorAudioQueue_1 = require("../../queues/directorAudioQueue");
const BASE_DIR = path_1.default.join(process.cwd(), 'storage', 'director');
const createVoiceJob = async (req, res) => {
    const { script, voiceId, speed, language, metadata } = req.body || {};
    if (!script || typeof script !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid script',
        });
    }
    const job = await directorAudioQueue_1.directorAudioQueue.add('director-generate-audio', { script, voiceId, speed, language, metadata }, { attempts: 3, removeOnComplete: false, removeOnFail: false });
    return res.status(202).json({
        success: true,
        message: 'Voice generation started',
        data: { jobId: job.id },
    });
};
exports.createVoiceJob = createVoiceJob;
const getVoiceJobStatus = async (req, res) => {
    const { jobId } = req.params;
    const job = await directorAudioQueue_1.directorAudioQueue.getJob(jobId);
    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found',
        });
    }
    const state = await job.getState();
    const progress = job.progress || 0;
    const result = job.returnvalue || null;
    return res.status(200).json({
        success: true,
        message: 'Job status',
        data: { status: state, progress, result },
    });
};
exports.getVoiceJobStatus = getVoiceJobStatus;
const getFinalVoiceAssets = async (req, res) => {
    const { jobId } = req.params;
    const safe = jobId.replace(/[^a-zA-Z0-9_-]/g, '');
    const jobFolder = path_1.default.join(BASE_DIR, safe);
    const finalPath = path_1.default.join(jobFolder, 'final.mp3');
    const timelinePath = path_1.default.join(jobFolder, 'timeline.json');
    const existsFinal = fs_1.default.existsSync(finalPath);
    const existsJson = fs_1.default.existsSync(timelinePath);
    if (!existsFinal || !existsJson) {
        return res.status(404).json({
            success: false,
            message: 'Final audio not ready',
        });
    }
    return res.status(200).json({
        success: true,
        message: 'Final voice assets',
        data: {
            finalAudio: finalPath,
            timeline: timelinePath,
        },
    });
};
exports.getFinalVoiceAssets = getFinalVoiceAssets;
const downloadFinalAudio = async (req, res) => {
    const { jobId } = req.params;
    const safe = jobId.replace(/[^a-zA-Z0-9_-]/g, '');
    const jobFolder = path_1.default.join(BASE_DIR, safe);
    const finalPath = path_1.default.join(jobFolder, 'final.mp3');
    if (!fs_1.default.existsSync(finalPath)) {
        return res.status(404).send('Final audio not found');
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${jobId}.mp3"`);
    fs_1.default.createReadStream(finalPath).pipe(res);
};
exports.downloadFinalAudio = downloadFinalAudio;
