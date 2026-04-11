"use strict";
// src/queues/lookbookWorker.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLookbookWorkers = void 0;
const bull_1 = __importDefault(require("bull"));
const path_1 = __importDefault(require("path"));
const REDIS_URL = (process.env.REDIS_URL || "redis://127.0.0.1:6379");
const initLookbookWorkers = () => {
    console.log("📘 Initializing Lookbook Workers (Bull v3)...");
    const lookbookImageQueue = new bull_1.default("lookbook-image-queue", REDIS_URL);
    lookbookImageQueue.process(path_1.default.join(__dirname, "../lookbook/services/editorial/lookbookOrchestrator.ts"));
    const lookbookPdfQueue = new bull_1.default("lookbook-pdf-queue", REDIS_URL);
    lookbookPdfQueue.process(path_1.default.join(__dirname, "../lookbook/services/lookbookPdfService.ts"));
    const lookbookVideoQueue = new bull_1.default("lookbook-video-queue", REDIS_URL);
    lookbookVideoQueue.process(path_1.default.join(__dirname, "../lookbook/services/lookbookVideoService.ts"));
    console.log("📗 Lookbook Workers Ready (Bull v3).");
};
exports.initLookbookWorkers = initLookbookWorkers;
