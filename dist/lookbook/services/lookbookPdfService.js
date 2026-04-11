"use strict";
// src/lookbook/services/lookbookPdfService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLookbookPdf = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateLookbookPdf = async (jobId, imageUrls, preset, title) => {
    const baseDir = path_1.default.join(process.cwd(), 'storage', 'lookbook', jobId);
    await fs_1.default.promises.mkdir(baseDir, { recursive: true });
    const pdfPath = path_1.default.join(baseDir, 'lookbook.pdf');
    await fs_1.default.promises.writeFile(pdfPath, Buffer.from(`PDF for job ${jobId} with ${imageUrls.length} images`), 'utf8');
    return pdfPath;
};
exports.generateLookbookPdf = generateLookbookPdf;
