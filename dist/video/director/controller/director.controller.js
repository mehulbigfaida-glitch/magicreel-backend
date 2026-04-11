"use strict";
// src/video/director/controller/director.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDirectorVoiceJob = void 0;
const director_service_1 = require("../service/director.service");
const handleDirectorVoiceJob = async (req, res) => {
    try {
        const { script, voiceId, speed, language } = req.body;
        if (!script) {
            return res.status(400).json({
                success: false,
                message: "script is required",
            });
        }
        const jobId = Date.now().toString();
        const result = await (0, director_service_1.processDirectorVoiceJob)(jobId, {
            script,
            voiceId,
            speed,
            language,
        });
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        console.error("[handleDirectorVoiceJob] Error:", err);
        return res.status(500).json({
            success: false,
            error: err.message || "Internal server error",
        });
    }
};
exports.handleDirectorVoiceJob = handleDirectorVoiceJob;
