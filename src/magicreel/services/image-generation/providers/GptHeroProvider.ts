// src/magicreel/services/image-generation/providers/fal.provider.ts

import axios from "axios";
import { fal } from "@fal-ai/client";
import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

export interface GenerateHeroRequest {
  garmentImageUrl: string;
  modelImageUrl: string;
  prompt: string;
}

export interface GenerateHeroResponse {
  imageUrl: string;
}

import { uploadToCloudinary } from "../../../../config/cloudinary";

fal.config({
  credentials: process.env.FAL_KEY!,
});

const CLOUDINARY_FOLDER = "magicreel/heroes";

interface FalImage {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
  file_name?: string;
}

interface FalResult {
  images: FalImage[];
}

export class GptHeroProvider {
  public async generateHero(
  request: GenerateHeroRequest
): Promise<GenerateHeroResponse> {
    try {
      console.info(
        "[GptHeroProvider] Starting Hero generation"
      );

      const input: Record<string, unknown> = {
  prompt: request.prompt,

  image_urls: [
    request.garmentImageUrl,
    request.modelImageUrl,
  ],

  num_images: 1,

  output_format: "png",

  quality: "medium",

  image_size: {
    width: 1856,
    height: 2304,
  },
};

      console.log("========== FAL INPUT ==========");
      console.dir(input, { depth: null });

      const result = await fal.subscribe(
        "openai/gpt-image-2/edit",
        {
          input,
          logs: true,
          onQueueUpdate(update) {
            if (update.status === "IN_PROGRESS") {
              for (const log of update.logs ?? []) {
                console.info(
                  `[GptHeroProvider] ${log.message}`
                );
              }
            }
          },
        }
      );

      const data = result.data as FalResult;

      const image = data.images?.[0];

if (!image) {
  throw new Error(
    "GPT Hero generation returned no image."
  );
}

const cloudinaryUrl =
  await this.uploadImage(image.url);

console.info(
  "[GptHeroProvider] Hero generated successfully"
);

return {
  imageUrl: cloudinaryUrl,
};

    } catch (error: any) {

      console.error(
        "========== FAL ERROR =========="
      );

      console.dir(error, {
        depth: null,
        colors: true,
      });

      if (error?.body) {
        console.log(
          "========== FAL BODY =========="
        );

        console.log(
          JSON.stringify(
            error.body,
            null,
            2
          )
        );
      }

      if (error?.response) {
        console.log(
          "========== FAL RESPONSE =========="
        );

        console.dir(
          error.response,
          {
            depth: null,
            colors: true,
          }
        );
      }

      throw error instanceof Error
        ? error
        : new Error(
            "Hero generation failed."
          );
    }
  }

  private async uploadImage(
  imageUrl: string
): Promise<string> {

  const extension =
    this.getExtension(imageUrl);

  const tempFile = path.join(
    os.tmpdir(),
    `${randomUUID()}.${extension}`
  );

  try {

    const response =
      await axios.get<ArrayBuffer>(
        imageUrl,
        {
          responseType: "arraybuffer",
          timeout: 60000,
        }
      );

    fs.writeFileSync(
      tempFile,
      Buffer.from(response.data)
    );

    const uploaded =
      await uploadToCloudinary(
        tempFile,
        {
          folder: CLOUDINARY_FOLDER,
        }
      );

    return uploaded.secure_url;

  } finally {

    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

  }

}

  private getExtension(
    url: string
  ): string {

    try {

      const pathname =
        new URL(url).pathname;

      const ext = path
        .extname(pathname)
        .replace(".", "");

      if (ext) {
        return ext;
      }

    } catch {
      // Ignore malformed URL.
    }

    return "png";
  }
}

export const gptHeroProvider =
  new GptHeroProvider();