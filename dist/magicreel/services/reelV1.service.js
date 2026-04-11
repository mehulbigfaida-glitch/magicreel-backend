"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reelV1Service = void 0;
const replicate_1 = __importDefault(require("replicate"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const prisma_1 = require("../db/prisma");
const replicate = new replicate_1.default({
    auth: process.env.REPLICATE_API_TOKEN,
});
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
function downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
        const file = fs_1.default.createWriteStream(outputPath);
        https_1.default.get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                resolve();
            });
        }).on("error", (err) => {
            fs_1.default.unlinkSync(outputPath);
            reject(err);
        });
    });
}
exports.reelV1Service = {
    async generate({ imageUrl, jobId, // ✅ ADD
     }) {
        if (!imageUrl) {
            throw new Error("imageUrl is required");
        }
        console.log("🎬 Sending to Kling v2.1:", imageUrl);
        const prediction = await replicate.predictions.create({
            version: "kwaivgi/kling-v2.1",
            input: {
                start_image: imageUrl,
                prompt: "A fashion model walking naturally towards camera, cinematic lighting, smooth motion",
                duration: 5,
            },
        });
        console.log("⏳ Waiting for result...");
        let result = prediction;
        let attempts = 0;
        const MAX_ATTEMPTS = 60;
        while (result.status !== "succeeded" &&
            result.status !== "failed") {
            if (attempts >= MAX_ATTEMPTS) {
                throw new Error("Kling timeout");
            }
            attempts++;
            await new Promise((r) => setTimeout(r, 3000));
            result = await replicate.predictions.get(result.id);
            console.log("⏳ status:", result.status);
        }
        if (result.status !== "succeeded") {
            console.error("❌ Kling failed:", result);
            throw new Error("Kling generation failed");
        }
        let videoUrl = null;
        if (typeof result.output === "string") {
            videoUrl = result.output;
        }
        else if (Array.isArray(result.output) && result.output.length > 0) {
            videoUrl = result.output[0];
        }
        if (!videoUrl) {
            throw new Error("No video URL returned from Kling");
        }
        console.log("⬇️ Downloading video...");
        const tempDir = path_1.default.join(process.cwd(), "storage", "reels");
        fs_1.default.mkdirSync(tempDir, { recursive: true });
        const localPath = path_1.default.join(tempDir, `reel-${Date.now()}.mp4`);
        await downloadFile(videoUrl, localPath);
        console.log("☁️ Uploading to Cloudinary...");
        const upload = await cloudinary_1.v2.uploader.upload(localPath, {
            resource_type: "video",
            folder: "magicreel/reels",
        });
        fs_1.default.unlinkSync(localPath);
        console.log("✅ Cloudinary URL:", upload.secure_url);
        // ✅ NEW: SAVE TO DB
        try {
            await prisma_1.prisma.render.create({
                data: {
                    outputImageUrl: null,
                    reelVideoUrl: upload?.secure_url || upload?.url || null,
                    type: "REEL",
                    status: "completed",
                    pose: "REEL",
                    engine: "KLING_V2",
                    modelImageUrl: imageUrl,
                    garmentImageUrl: imageUrl,
                    lookbook: {
                        connect: {
                            id: "lookbook-default-1",
                        },
                    },
                },
            });
        }
        catch (e) {
            console.error("❌ Reel save failed:", e);
        }
        // ✅ RETURN (KEEP OUTSIDE TRY)
        return {
            reelVideoUrl: upload?.secure_url || upload?.url || null,
            predictionId: result.id,
        };
    }, // ✅ CLOSE FUNCTION
}; // ✅ CLOSE OBJECT
