"use strict";
// src/video/director/controller/directorOrchestrator.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.orchestrateDirector = void 0;
const directorOrchestrator_1 = require("../service/directorOrchestrator");
const orchestrateDirector = async (req, res) => {
    const { script, voiceId, speed, language, metadata } = req.body || {};
    if (!script) {
        return res.status(400).json({
            success: false,
            message: "Missing script",
        });
    }
    const result = await (0, directorOrchestrator_1.orchestrateDirectorMode)({
        script,
        voiceId,
        speed,
        language,
        metadata,
    });
    return res.status(200).json({
        success: true,
        message: "Director Mode Orchestration Started",
        data: result,
    });
};
exports.orchestrateDirector = orchestrateDirector;
