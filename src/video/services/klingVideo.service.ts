// src/video/services/klingVideo.service.ts
// FINAL – KLING 2.1 (DYNAMIC PROMPT + STREAM SAFE)

import fs from "fs";
import path from "path";
import Replicate from "replicate";
import { Readable } from "stream";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export class KlingVideoService {
  async generateClip(params: {
    imagePath: string;
    outputVideoPath: string;
    prompt: string;          // 🔥 NEW
    duration?: number;       // 🔥 NEW
    negativePrompt?: string; // 🔥 OPTIONAL
  }): Promise<void> {

    const {
      imagePath,
      outputVideoPath,
      prompt,
      duration = 10,
      negativePrompt,
    } = params;

    if (!fs.existsSync(imagePath)) {
      throw new Error("Input image not found");
    }

    const imageBuffer = fs.readFileSync(imagePath);

    const input: any = {
      mode: "standard",
      duration,
      start_image: imageBuffer,
      prompt,
    };

    // ✅ optional negative prompt
    if (negativePrompt) {
      input.negative_prompt = negativePrompt;
    }

    console.log("🎬 KLING REQUEST");
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
      console.error("RAW OUTPUT:", output);
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