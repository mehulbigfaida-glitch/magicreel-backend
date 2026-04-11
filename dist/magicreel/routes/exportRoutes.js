"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const fashnVideo_service_1 = require("../services/fashnVideo.service");
const router = express_1.default.Router();
const TEMP_DIR = path_1.default.join(process.cwd(), "temp");
// ✅ CONFIRMED WATERMARK ASSET
const WATERMARK_LOGO = path_1.default.join(process.cwd(), "assets", "magicreel-icon-white.png");
if (!fs_1.default.existsSync(TEMP_DIR)) {
    fs_1.default.mkdirSync(TEMP_DIR, { recursive: true });
}
router.post("/reel", async (req, res) => {
    console.log("🔥 EXPORT REEL ROUTE HIT");
    console.log("📥 BODY:", req.body);
    try {
        const { baseImageUrl, withWatermark = true, resolution = "480p", } = req.body;
        if (!baseImageUrl) {
            return res
                .status(400)
                .json({ error: "baseImageUrl required" });
        }
        const absoluteImageUrl = baseImageUrl.startsWith("http")
            ? baseImageUrl
            : `http://localhost:5001${baseImageUrl}`;
        console.log("🖼 IMAGE URL:", absoluteImageUrl);
        // 1️⃣ Generate reel using FASHN
        const fashnVideoUrl = await (0, fashnVideo_service_1.generateFashnVideo)(absoluteImageUrl, {
            duration: 5,
            resolution,
        });
        console.log("🎬 FASHN VIDEO URL:", fashnVideoUrl);
        // 2️⃣ No watermark → return directly
        if (!withWatermark) {
            return res.json({ videoUrl: fashnVideoUrl });
        }
        // 3️⃣ Download FASHN video
        const inputVideoPath = path_1.default.join(TEMP_DIR, `input_${Date.now()}.mp4`);
        const outputVideoPath = path_1.default.join(TEMP_DIR, `watermarked_${Date.now()}.mp4`);
        const videoResponse = await axios_1.default.get(fashnVideoUrl, { responseType: "stream" });
        await new Promise((resolve, reject) => {
            const writer = fs_1.default.createWriteStream(inputVideoPath);
            videoResponse.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
        // 4️⃣ Apply watermark (bottom-right)
        const ffmpegCmd = `ffmpeg -y -i "${inputVideoPath}" -i "${WATERMARK_LOGO}" -filter_complex "overlay=W-w-24:H-h-24" -movflags faststart "${outputVideoPath}"`;
        await new Promise((resolve, reject) => {
            (0, child_process_1.exec)(ffmpegCmd, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
        // 5️⃣ Serve watermarked video
        const publicPath = `/temp/${path_1.default.basename(outputVideoPath)}`;
        console.log("🏷 WATERMARKED VIDEO:", publicPath);
        return res.json({
            videoUrl: `http://localhost:5001${publicPath}`,
        });
    }
    catch (err) {
        console.error("❌ EXPORT REEL FAILED:", err);
        return res.status(500).json({
            error: "Reel export failed",
            details: err?.message,
        });
    }
});
exports.default = router;
