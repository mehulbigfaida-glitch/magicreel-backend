"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFashnVideo = generateFashnVideo;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";
const FASHN_API_KEY = process.env.FASHN_API_KEY;
async function generateFashnVideo(localImagePathOrUrl, options) {
    /* -------------------------------------------------
       1️⃣ ENSURE PUBLIC IMAGE URL (CLOUDINARY)
    -------------------------------------------------- */
    let publicImageUrl = localImagePathOrUrl;
    if (localImagePathOrUrl.startsWith("http://localhost") ||
        localImagePathOrUrl.startsWith("/")) {
        const absolutePath = localImagePathOrUrl.startsWith("http")
            ? path_1.default.join(process.cwd(), localImagePathOrUrl.replace("http://localhost:5001", ""))
            : path_1.default.join(process.cwd(), localImagePathOrUrl);
        if (!fs_1.default.existsSync(absolutePath)) {
            throw new Error(`Image not found: ${absolutePath}`);
        }
        const imageBuffer = fs_1.default.readFileSync(absolutePath);
        // ✅ This function returns a STRING (public URL)
        const uploadedImageUrl = await (0, cloudinaryUpload_1.uploadBufferToCloudinary)(imageBuffer, "magicreel/reels/source");
        publicImageUrl = uploadedImageUrl;
    }
    /* -------------------------------------------------
       2️⃣ SUBMIT FASHN IMAGE → VIDEO JOB
    -------------------------------------------------- */
    let predictionId;
    try {
        const runRes = await axios_1.default.post(FASHN_RUN_URL, {
            model_name: "image-to-video",
            inputs: {
                image: publicImageUrl,
                duration: options?.duration ?? 5,
                resolution: options?.resolution ?? "480p",
            },
        }, {
            headers: {
                Authorization: `Bearer ${FASHN_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        predictionId = runRes.data?.id;
        if (!predictionId) {
            console.error("❌ FASHN RUN RESPONSE:", runRes.data);
            throw new Error("No prediction ID returned by Fashn");
        }
    }
    catch (err) {
        console.error("❌ FASHN RUN ERROR:", err?.response?.data || err);
        throw new Error("Fashn run request failed");
    }
    /* -------------------------------------------------
       3️⃣ POLL STATUS
    -------------------------------------------------- */
    while (true) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
            const statusRes = await axios_1.default.get(`${FASHN_STATUS_URL}/${predictionId}`, {
                headers: {
                    Authorization: `Bearer ${FASHN_API_KEY}`,
                },
            });
            const { status, output, error } = statusRes.data;
            if (status === "completed") {
                if (!output || !output[0]) {
                    throw new Error("Fashn completed but returned no video");
                }
                return output[0]; // MP4 URL
            }
            if (status === "failed") {
                console.error("❌ FASHN FAILED:", error);
                throw new Error(typeof error === "string"
                    ? error
                    : JSON.stringify(error));
            }
        }
        catch (err) {
            console.error("❌ FASHN STATUS ERROR:", err?.response?.data || err);
            throw new Error("Fashn status polling failed");
        }
    }
}
