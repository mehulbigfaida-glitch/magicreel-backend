import Replicate from "replicate";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import https from "https";
import prisma from "../db/prisma"; // ✅ ADD

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

export const reelV1Service = {
  async generate({
    imageUrl,
    jobId, // ✅ ADD
  }: {
    imageUrl: string;
    jobId?: string; // ✅ ADD
  }) {
    if (!imageUrl) {
      throw new Error("imageUrl is required");
    }

    console.log("🎬 Sending to Kling v2.1:", imageUrl);

    const prediction = await replicate.predictions.create({
      version: "kwaivgi/kling-v2.1",
      input: {
        start_image: imageUrl,
        prompt:
          "A fashion model walking naturally towards camera, cinematic lighting, smooth motion",
        duration: 5,
      },
    });

    console.log("⏳ Waiting for result...");

    let result = prediction;
    let attempts = 0;
    const MAX_ATTEMPTS = 60;

    while (
      result.status !== "succeeded" &&
      result.status !== "failed"
    ) {
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

    let videoUrl: string | null = null;

    if (typeof result.output === "string") {
      videoUrl = result.output;
    } else if (Array.isArray(result.output) && result.output.length > 0) {
      videoUrl = result.output[0];
    }

    if (!videoUrl) {
      throw new Error("No video URL returned from Kling");
    }

    console.log("⬇️ Downloading video...");

    const tempDir = path.join(process.cwd(), "storage", "reels");
    fs.mkdirSync(tempDir, { recursive: true });

    const localPath = path.join(tempDir, `reel-${Date.now()}.mp4`);

    await downloadFile(videoUrl, localPath);

    console.log("☁️ Uploading to Cloudinary...");

    const upload = await cloudinary.uploader.upload(localPath, {
      resource_type: "video",
      folder: "magicreel/reels",
    });

    fs.unlinkSync(localPath);

    console.log("✅ Cloudinary URL:", upload.secure_url);

    // ✅ NEW: SAVE TO DB
    if (jobId) {
      await prisma.render.update({
  where: { id: jobId },
  data: {
  outputImageUrl: upload.secure_url,
},
});
    }

    return {
      reelVideoUrl: upload.secure_url,
      predictionId: result.id,
    };
  },
};