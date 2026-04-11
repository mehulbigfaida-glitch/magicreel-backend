"use strict";
// src/video/director/controller/directorScenesEngine.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectorScenesStatus = exports.generateDirectorScenes = void 0;
const directorSceneQueue_1 = require("../../queues/directorSceneQueue");
const generateDirectorScenes = async (req, res) => {
    const { jobId, timelinePath, audioDurationMs } = req.body || {};
    if (!jobId || !timelinePath || !audioDurationMs) {
        return res.status(400).json({
            success: false,
            message: 'jobId, timelinePath and audioDurationMs are required',
        });
    }
    const job = await directorSceneQueue_1.directorSceneQueue.add('director-generate-scenes', { jobId, timelinePath, audioDurationMs }, { attempts: 3, removeOnComplete: false, removeOnFail: false });
    return res.status(202).json({
        success: true,
        message: 'Scene generation started',
        data: { jobId: job.id },
    });
};
exports.generateDirectorScenes = generateDirectorScenes;
const getDirectorScenesStatus = async (req, res) => {
    const { jobId } = req.params;
    const job = await directorSceneQueue_1.directorSceneQueue.getJob(jobId);
    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Scene job not found',
        });
    }
    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;
    return res.status(200).json({
        success: true,
        message: 'Scene job status',
        data: { status: state, progress, result },
    });
};
exports.getDirectorScenesStatus = getDirectorScenesStatus;
