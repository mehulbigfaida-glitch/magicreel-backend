"use strict";
// src/video/queues/directorSceneQueue.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directorSceneQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const REDIS_URL = (process.env.REDIS_URL || "redis://127.0.0.1:6379");
exports.directorSceneQueue = new bull_1.default("director-scene-queue", REDIS_URL);
