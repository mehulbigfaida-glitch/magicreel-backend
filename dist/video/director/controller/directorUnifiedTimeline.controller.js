"use strict";
// src/video/director/controller/directorUnifiedTimeline.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUnifiedDirectorTimeline = void 0;
const path_1 = __importDefault(require("path"));
const directorTimelineBuilder_1 = require("../utils/directorTimelineBuilder");
const BASE_DIR = path_1.default.join(process.cwd(), 'storage', 'director');
const buildUnifiedDirectorTimeline = async (req, res) => {
    const { jobId, audioPath, durationMs } = req.body || {};
    if (!jobId || !audioPath || !durationMs) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }
    const timeline = await (0, directorTimelineBuilder_1.buildUnifiedTimeline)(jobId, audioPath, durationMs);
    const unifiedPath = await (0, directorTimelineBuilder_1.saveUnifiedTimeline)(jobId, BASE_DIR, timeline);
    return res.status(200).json({
        success: true,
        message: "Unified timeline created",
        data: {
            unifiedTimelinePath: unifiedPath,
        },
    });
};
exports.buildUnifiedDirectorTimeline = buildUnifiedDirectorTimeline;
