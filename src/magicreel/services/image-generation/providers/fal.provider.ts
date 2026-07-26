// src/magicreel/services/image-generation/providers/fal.provider.ts

import axios from "axios";
import { fal } from "@fal-ai/client";
import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

import {
  GenerateEditedImageRequest,
  GenerateEditedImageResponse,
  GeneratedImage,
} from "../imageGeneration.types";

import { uploadToCloudinary } from "../../../../config/cloudinary";

fal.config({
  credentials: process.env.FAL_KEY!,
});

const CLOUDINARY_FOLDER = "magicreel/campaigns";

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

export class FalImageProvider {
  public async generateEditedImages(
    request: GenerateEditedImageRequest
  ): Promise<GenerateEditedImageResponse> {
    try {
      console.info(
        "[FalImageProvider] Starting GPT Image 2 generation"
      );

      const input: Record<string, unknown> = {
  prompt: request.prompt,

  image_urls: request.referenceImages,

  num_images: request.numImages ?? 1,

  output_format: request.outputFormat ?? "png",

  quality: request.quality ?? "low",
};

console.log("=== FAL INPUT ===");
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
                  `[FalImageProvider] ${log.message}`
                );
              }
            }
          },
        }
      );

      const data = result.data as FalResult;

      const images = data.images ?? [];

      if (images.length === 0) {
        throw new Error(
          "FAL returned no generated images."
        );
      }

      const uploadedImages: GeneratedImage[] = [];

      for (const image of images) {
        const cloudinaryUrl =
          await this.uploadImage(image.url);

        uploadedImages.push({
          url: cloudinaryUrl,
          width: image.width,
          height: image.height,
          contentType: image.content_type,
          fileName: image.file_name,
        });
      }

      console.info(
        `[FalImageProvider] Successfully generated ${uploadedImages.length} image(s)`
      );

      return {
        images: uploadedImages,
      };
    } catch (error) {
      console.error(
        "[FalImageProvider] Image generation failed",
        error
      );

      throw error instanceof Error
        ? error
        : new Error("Image generation failed.");
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
        await uploadToCloudinary(tempFile, {
          folder: CLOUDINARY_FOLDER,
        });

      return uploaded.secure_url;
    } catch (error) {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

      console.error(
        "[FalImageProvider] Cloudinary upload failed",
        error
      );

      throw error instanceof Error
        ? error
        : new Error("Cloudinary upload failed.");
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

export const falImageProvider =
  new FalImageProvider();