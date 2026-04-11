"use strict";
// src/tryon/services/ResolutionNormalizerService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolutionNormalizerService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const cloudinaryUpload_1 = require("./cloudinaryUpload");
/**
 * ResolutionNormalizerService
 *
 * - Supports legacy instance-based URL normalization
 * - Adds STATIC buffer-based normalization for V2 pipeline
 * - MODEL is always the canvas
 */
class ResolutionNormalizerService {
    // --------------------------------------------------
    // ✅ LEGACY INSTANCE METHOD (DO NOT REMOVE)
    // --------------------------------------------------
    async normalizeImage(imageUrl) {
        const buffer = Buffer.from((await axios_1.default.get(imageUrl, {
            responseType: "arraybuffer",
        })).data);
        const normalizedBuffer = await (0, sharp_1.default)(buffer)
            .resize({
            width: 1024,
            height: 1600,
            fit: "inside",
        })
            .png()
            .toBuffer();
        const tempDir = path_1.default.join(process.cwd(), "temp");
        if (!fs_1.default.existsSync(tempDir))
            fs_1.default.mkdirSync(tempDir);
        const tempPath = path_1.default.join(tempDir, `normalized_${(0, uuid_1.v4)()}.png`);
        fs_1.default.writeFileSync(tempPath, normalizedBuffer);
        const normalizedUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(tempPath, "magicreel/normalized/legacy");
        return { normalizedUrl };
    }
    // --------------------------------------------------
    // 🔥 NEW STATIC METHOD — USED BY TryOnServiceV2
    // --------------------------------------------------
    static async normalizeImage(modelBuffer, garmentBuffer) {
        const modelMeta = await (0, sharp_1.default)(modelBuffer).metadata();
        if (!modelMeta.width || !modelMeta.height) {
            throw new Error("Invalid model image dimensions");
        }
        const modelWidth = modelMeta.width;
        const modelHeight = modelMeta.height;
        // MODEL = CANVAS
        const normalizedModel = await (0, sharp_1.default)(modelBuffer)
            .resize(modelWidth, modelHeight, { fit: "fill" })
            .png()
            .toBuffer();
        // GARMENT MUST FIT INSIDE MODEL
        const normalizedGarment = await (0, sharp_1.default)(garmentBuffer)
            .resize({
            width: modelWidth,
            height: modelHeight,
            fit: "inside",
            withoutEnlargement: true,
        })
            .png()
            .toBuffer();
        return {
            model: normalizedModel,
            garment: normalizedGarment,
        };
    }
}
exports.ResolutionNormalizerService = ResolutionNormalizerService;
