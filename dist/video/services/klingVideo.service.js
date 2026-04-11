"use strict";
// src/video/services/klingVideo.service.ts
// FINAL – KLING 2.1 (URL INPUT + STREAM SAFE)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.klingVideoService = exports.KlingVideoService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const replicate_1 = __importDefault(require("replicate"));
const stream_1 = require("stream");
const replicate = new replicate_1.default({
    auth: process.env.REPLICATE_API_TOKEN,
});
class KlingVideoService {
    async generateClip(params) {
        const { imageUrl, outputVideoPath, prompt, duration = 10, negativePrompt, } = params;
        if (!imageUrl) {
            throw new Error("start_image URL is required");
        }
        const input = {
            mode: "standard",
            duration,
            start_image: imageUrl, // ✅ FIXED (URL, not buffer)
            prompt,
        };
        if (negativePrompt) {
            input.negative_prompt = negativePrompt;
        }
        console.log("🎬 KLING REQUEST");
        console.log("Start Image:", imageUrl);
        console.log("Duration:", duration);
        console.log("🔑 Replicate token present:", !!process.env.REPLICATE_API_TOKEN);
        /* ----------------------------------
           RUN KLING
        ---------------------------------- */
        const output = await replicate.run("kwaivgi/kling-v2.1", { input });
        /* ----------------------------------
           STREAM HANDLING
        ---------------------------------- */
        if (!output || typeof output.getReader !== "function") {
            console.error("❌ RAW OUTPUT:", output);
            throw new Error("Kling output is not a Web ReadableStream");
        }
        const nodeStream = stream_1.Readable.fromWeb(output);
        fs_1.default.mkdirSync(path_1.default.dirname(outputVideoPath), { recursive: true });
        await new Promise((resolve, reject) => {
            const writeStream = fs_1.default.createWriteStream(outputVideoPath);
            nodeStream.pipe(writeStream);
            nodeStream.on("error", reject);
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        });
        console.log("✅ KLING VIDEO SAVED:", outputVideoPath);
    }
}
exports.KlingVideoService = KlingVideoService;
exports.klingVideoService = new KlingVideoService();
