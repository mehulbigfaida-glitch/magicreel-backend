"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhanceHeroImage = enhanceHeroImage;
const replicate_1 = __importDefault(require("replicate"));
const cloudinary_1 = require("cloudinary");
/**
 * 🔒 BACKEND CLOUDINARY CONFIG (REQUIRED)
 * Frontend config does NOT apply here.
 */
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const replicate = new replicate_1.default();
/**
 * Enhance hero image using Replicate Real-ESRGAN (x2)
 * - Includes retry logic for 429 rate limits
 * - Uploads to Cloudinary as hero_preview.png
 */
async function enhanceHeroImage(params) {
    const { jobId, heroBaseUrl } = params;
    if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error("REPLICATE_API_TOKEN missing in env");
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary backend env vars missing");
    }
    // 1️⃣ Run ESRGAN with retry logic
    let output;
    try {
        output = await replicate.run("nightmareai/real-esrgan", {
            input: {
                image: heroBaseUrl,
                scale: 2,
                face_enhance: false,
            },
        });
    }
    catch (err) {
        // Handle rate limit (429)
        if (err?.response?.status === 429) {
            const retryAfter = Number(err?.response?.headers?.get?.("retry-after")) || 7;
            console.log(`Replicate rate-limited. Retrying in ${retryAfter}s...`);
            await new Promise((r) => setTimeout(r, retryAfter * 1000));
            // Retry once
            output = await replicate.run("nightmareai/real-esrgan", {
                input: {
                    image: heroBaseUrl,
                    scale: 2,
                    face_enhance: false,
                },
            });
        }
        else {
            throw err;
        }
    }
    // 2️⃣ Resolve Replicate output URL
    let enhancedImageUrl = null;
    if (output && typeof output.url === "function") {
        enhancedImageUrl = output.url();
    }
    if (!enhancedImageUrl) {
        throw new Error("ESRGAN returned no output URL");
    }
    // 3️⃣ Download enhanced image
    const response = await fetch(enhancedImageUrl);
    if (!response.ok) {
        throw new Error(`Failed to download enhanced image (${response.status})`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    // 4️⃣ Upload to Cloudinary as hero_preview.png
    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({
            folder: `magicreel/${jobId}/hero`,
            public_id: "hero_preview",
            overwrite: true,
            resource_type: "image",
            format: "png",
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        })
            .end(buffer);
    });
    return {
        heroPreviewUrl: uploadResult.secure_url,
    };
}
