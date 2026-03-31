// src/video/services/klingVideo.service.ts
// FINAL – KLING 2.1 (URL INPUT + STREAM SAFE)

import fs from "fs";
import path from "path";
import Replicate from "replicate";
import { Readable } from "stream";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export class KlingVideoService {
  async generateClip(params: {
    imageUrl: string;        // 🔥 URL instead of local path
    outputVideoPath: string;
    prompt: string;
    duration?: number;
    negativePrompt?: string;
  }): Promise<void> {

    const {
      imageUrl,
      outputVideoPath,
      prompt,
      duration = 10,
      negativePrompt,
    } = params;

    if (!imageUrl) {
      throw new Error("start_image URL is required");
    }

    const input: any = {
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

    const output: any = await replicate.run(
      "kwaivgi/kling-v2.1",
      { input }
    );

    /* ----------------------------------
       STREAM HANDLING
    ---------------------------------- */

    if (!output || typeof output.getReader !== "function") {
      console.error("❌ RAW OUTPUT:", output);
      throw new Error("Kling output is not a Web ReadableStream");
    }

    const nodeStream = Readable.fromWeb(output);

    fs.mkdirSync(path.dirname(outputVideoPath), { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(outputVideoPath);
      nodeStream.pipe(writeStream);
      nodeStream.on("error", reject);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log("✅ KLING VIDEO SAVED:", outputVideoPath);
  }
}

export const klingVideoService = new KlingVideoService();