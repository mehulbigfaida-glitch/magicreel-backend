"use strict";
// src/lookbook/services/lookbookVideoService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLookbookVideo = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateLookbookVideo = async (jobId, imageUrls, preset, metadata) => {
    const baseDir = path_1.default.join(process.cwd(), 'storage', 'lookbook', jobId);
    await fs_1.default.promises.mkdir(baseDir, { recursive: true });
    const videoPath = path_1.default.join(baseDir, 'lookbook_video.mp4');
    await fs_1.default.promises.writeFile(videoPath, Buffer.alloc(50)); // stub
    return videoPath;
};
exports.generateLookbookVideo = generateLookbookVideo;
