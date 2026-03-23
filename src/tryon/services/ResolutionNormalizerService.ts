// src/tryon/services/ResolutionNormalizerService.ts

import sharp from "sharp";
import fs from "fs";
import path from "path";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { uploadToCloudinary } from "./cloudinaryUpload";

/**
 * ResolutionNormalizerService
 *
 * - Supports legacy instance-based URL normalization
 * - Adds STATIC buffer-based normalization for V2 pipeline
 * - MODEL is always the canvas
 */
export class ResolutionNormalizerService {
  // --------------------------------------------------
  // ✅ LEGACY INSTANCE METHOD (DO NOT REMOVE)
  // --------------------------------------------------
  async normalizeImage(imageUrl: string): Promise<{
    normalizedUrl: string;
  }> {
    const buffer = Buffer.from(
      (
        await axios.get(imageUrl, {
          responseType: "arraybuffer",
        })
      ).data
    );

    const normalizedBuffer = await sharp(buffer)
      .resize({
        width: 1024,
        height: 1600,
        fit: "inside",
      })
      .png()
      .toBuffer();

    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const tempPath = path.join(
      tempDir,
      `normalized_${uuidv4()}.png`
    );

    fs.writeFileSync(tempPath, normalizedBuffer);

    const normalizedUrl = await uploadToCloudinary(
      tempPath,
      "magicreel/normalized/legacy"
    );

    return { normalizedUrl };
  }

  // --------------------------------------------------
  // 🔥 NEW STATIC METHOD — USED BY TryOnServiceV2
  // --------------------------------------------------
  static async normalizeImage(
    modelBuffer: Buffer,
    garmentBuffer: Buffer
  ): Promise<{
    model: Buffer;
    garment: Buffer;
  }> {
    const modelMeta = await sharp(modelBuffer).metadata();

    if (!modelMeta.width || !modelMeta.height) {
      throw new Error("Invalid model image dimensions");
    }

    const modelWidth = modelMeta.width;
    const modelHeight = modelMeta.height;

    // MODEL = CANVAS
    const normalizedModel = await sharp(modelBuffer)
      .resize(modelWidth, modelHeight, { fit: "fill" })
      .png()
      .toBuffer();

    // GARMENT MUST FIT INSIDE MODEL
    const normalizedGarment = await sharp(garmentBuffer)
      .resize({
        width: modelWidth,
        height: modelHeight,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();

    return {
      model: normalizedModel,
      garment: normalizedGarment,
    };
  }
}
