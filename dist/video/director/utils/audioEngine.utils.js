"use strict";
// src/video/director/utils/audioEngine.utils.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTimelineToDisk = exports.generateRealAudioForTimeline = exports.generateRealAudioForSegment = exports.buildTimelineForScript = exports.splitScriptIntoSegments = exports.estimateDurationMs = exports.ensureDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
/**
 * HELPERS
 */
const ensureDir = async (dirPath) => {
    await fs_1.default.promises.mkdir(dirPath, { recursive: true });
};
exports.ensureDir = ensureDir;
const estimateDurationMs = (text, speed = 1.0) => {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (!cleaned)
        return 0;
    const words = cleaned.split(' ').length;
    const baseWpm = 165;
    const effectiveWpm = baseWpm * speed;
    return Math.round((words / effectiveWpm) * 60000);
};
exports.estimateDurationMs = estimateDurationMs;
/**
 * Split text into chunks under maxSegmentChars.
 */
const splitScriptIntoSegments = (script, maxChars) => {
    const output = [];
    const cleaned = script.replace(/\s+/g, ' ').trim();
    if (!cleaned)
        return output;
    const sentences = cleaned
        .split(/([.!?])\s+/)
        .reduce((acc, part, idx) => {
        if (part.match(/[.!?]/) && idx > 0) {
            acc[acc.length - 1] = acc[acc.length - 1] + part;
        }
        else if (part.trim()) {
            acc.push(part.trim());
        }
        return acc;
    }, []);
    let buffer = '';
    for (const sentence of sentences) {
        const test = buffer ? `${buffer} ${sentence}` : sentence;
        if (test.length <= maxChars) {
            buffer = test;
            continue;
        }
        if (buffer) {
            output.push({
                id: `seg-${output.length + 1}`,
                index: output.length,
                text: buffer.trim(),
            });
            buffer = sentence;
        }
        else {
            let remain = sentence;
            while (remain.length > maxChars) {
                output.push({
                    id: `seg-${output.length + 1}`,
                    index: output.length,
                    text: remain.slice(0, maxChars).trim(),
                });
                remain = remain.slice(maxChars);
            }
            buffer = remain.trim();
        }
    }
    if (buffer.trim()) {
        output.push({
            id: `seg-${output.length + 1}`,
            index: output.length,
            text: buffer.trim(),
        });
    }
    return output;
};
exports.splitScriptIntoSegments = splitScriptIntoSegments;
/**
 * Build timeline
 */
const buildTimelineForScript = (jobId, script, config) => {
    const maxChars = config.maxSegmentChars || 380;
    const speed = config.speed || 1.0;
    const baseSegments = (0, exports.splitScriptIntoSegments)(script, maxChars);
    let cursor = 0;
    const segments = baseSegments.map((s) => {
        const approx = (0, exports.estimateDurationMs)(s.text, speed);
        const start = cursor;
        const end = start + approx;
        cursor = end;
        return {
            id: s.id,
            index: s.index,
            text: s.text,
            startMs: start,
            endMs: end,
            approximateDurationMs: approx,
            audioPath: null,
        };
    });
    return {
        jobId,
        rawScript: script,
        totalDurationMs: cursor,
        segments,
        config,
        createdAt: new Date().toISOString(),
    };
};
exports.buildTimelineForScript = buildTimelineForScript;
/**
 * Fetch OpenAI TTS audio for a segment
 */
const generateRealAudioForSegment = async (text, outputPath) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4o-mini-tts",
            voice: "alloy",
            input: text,
            format: "mp3",
            speed: 1.0,
        }),
    });
    const arrayBuf = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    await fs_1.default.promises.writeFile(outputPath, buffer);
};
exports.generateRealAudioForSegment = generateRealAudioForSegment;
/**
 * Generate all audio segments
 */
const generateRealAudioForTimeline = async (baseDir, timeline) => {
    const safeJob = timeline.jobId.replace(/[^a-zA-Z0-9_-]/g, '');
    const jobDir = path_1.default.join(baseDir, safeJob);
    await (0, exports.ensureDir)(jobDir);
    const updated = [];
    for (const seg of timeline.segments) {
        const filename = `${seg.id}-${(0, crypto_1.randomUUID)()}.mp3`;
        const output = path_1.default.join(jobDir, filename);
        await (0, exports.generateRealAudioForSegment)(seg.text, output);
        updated.push({
            ...seg,
            audioPath: output,
        });
    }
    return {
        ...timeline,
        segments: updated,
    };
};
exports.generateRealAudioForTimeline = generateRealAudioForTimeline;
/**
 * Save timeline.json
 */
const saveTimelineToDisk = async (baseDir, timeline) => {
    const safe = timeline.jobId.replace(/[^a-zA-Z0-9_-]/g, '');
    const folder = path_1.default.join(baseDir, safe);
    await (0, exports.ensureDir)(folder);
    const file = path_1.default.join(folder, 'timeline.json');
    await fs_1.default.promises.writeFile(file, JSON.stringify(timeline, null, 2), 'utf8');
    return file;
};
exports.saveTimelineToDisk = saveTimelineToDisk;
