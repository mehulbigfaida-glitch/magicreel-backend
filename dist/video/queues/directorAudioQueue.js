"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directorAudioQueue = void 0;
// src/video/queues/directorAudioQueue.ts
const bull_1 = __importDefault(require("bull"));
const REDIS_URL = (process.env.REDIS_URL || "redis://127.0.0.1:6379");
exports.directorAudioQueue = new bull_1.default("director-audio-queue", REDIS_URL);
