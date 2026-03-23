import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import axios from "axios";
import { exec } from "child_process";
import { generateFashnVideo } from "../services/fashnVideo.service";

const router = express.Router();

const TEMP_DIR = path.join(process.cwd(), "temp");

// ✅ CONFIRMED WATERMARK ASSET
const WATERMARK_LOGO = path.join(
  process.cwd(),
  "assets",
  "magicreel-icon-white.png"
);

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

router.post("/reel", async (req: Request, res: Response) => {
  console.log("🔥 EXPORT REEL ROUTE HIT");
  console.log("📥 BODY:", req.body);

  try {
    const {
      baseImageUrl,
      withWatermark = true,
      resolution = "480p",
    } = req.body as {
      baseImageUrl?: string;
      withWatermark?: boolean;
      resolution?: "480p" | "720p" | "1080p";
    };

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
    const fashnVideoUrl = await generateFashnVideo(
      absoluteImageUrl,
      {
        duration: 5,
        resolution,
      }
    );

    console.log("🎬 FASHN VIDEO URL:", fashnVideoUrl);

    // 2️⃣ No watermark → return directly
    if (!withWatermark) {
      return res.json({ videoUrl: fashnVideoUrl });
    }

    // 3️⃣ Download FASHN video
    const inputVideoPath = path.join(
      TEMP_DIR,
      `input_${Date.now()}.mp4`
    );
    const outputVideoPath = path.join(
      TEMP_DIR,
      `watermarked_${Date.now()}.mp4`
    );

    const videoResponse = await axios.get(
      fashnVideoUrl,
      { responseType: "stream" }
    );

    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(inputVideoPath);
      videoResponse.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // 4️⃣ Apply watermark (bottom-right)
    const ffmpegCmd = `ffmpeg -y -i "${inputVideoPath}" -i "${WATERMARK_LOGO}" -filter_complex "overlay=W-w-24:H-h-24" -movflags faststart "${outputVideoPath}"`;

    await new Promise<void>((resolve, reject) => {
      exec(ffmpegCmd, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // 5️⃣ Serve watermarked video
    const publicPath = `/temp/${path.basename(
      outputVideoPath
    )}`;

    console.log("🏷 WATERMARKED VIDEO:", publicPath);

    return res.json({
      videoUrl: `http://localhost:5001${publicPath}`,
    });
  } catch (err: any) {
    console.error("❌ EXPORT REEL FAILED:", err);
    return res.status(500).json({
      error: "Reel export failed",
      details: err?.message,
    });
  }
});

export default router;
