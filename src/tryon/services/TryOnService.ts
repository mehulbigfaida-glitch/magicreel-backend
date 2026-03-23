import axios from "axios";
import crypto from "crypto";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import "../../config/cloudinary";

const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";

/**
 * 🔒 INLINE GARMENT PREPROCESS (LENGTH-LOCKED)
 * This avoids ALL TypeScript path issues.
 */
async function preprocessGarmentLengthLocked(
  garmentUrl: string
): Promise<string> {
  console.log("👗 [Garment Preprocess INLINE] START:", garmentUrl);

  try {
    // 1️⃣ Download garment
    const response = await fetch(garmentUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buf = Buffer.from(new Uint8Array(arrayBuffer));

    // 2️⃣ Resize garment (width-controlled)
    const resized = await sharp(buf)
      .ensureAlpha()
      .resize({
        width: 900,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    // 3️⃣ Force FLOOR-LENGTH canvas
    const FINAL_WIDTH = 1024;
    const FINAL_HEIGHT = 1600;

    const padded = await sharp({
      create: {
        width: FINAL_WIDTH,
        height: FINAL_HEIGHT,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: resized,
          gravity: "south", // hem locked to bottom
        },
      ])
      .png()
      .toBuffer();

    // 4️⃣ Upload to Cloudinary
    const publicId = crypto.randomUUID();

    const url: string = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "magicreel/preprocessed-garments",
          public_id: publicId,
          resource_type: "image",
          format: "png",
        },
        (err, res) => {
          if (err || !res) return reject(err);
          resolve(res.secure_url);
        }
      );
      stream.end(padded);
    });

    console.log("✅ Garment length locked:", url);
    return url;
  } catch (err) {
    console.error("❌ Garment preprocess failed:", err);
    return garmentUrl; // safe fallback
  }
}

export class TryOnService {
  async generateTryOn(input: {
    modelImageUrl: string;
    garmentImageUrl: string;
  }) {
    // --------------------------------------------------
    // 🔒 STEP 0 — FORCE GARMENT LENGTH
    // --------------------------------------------------
    const finalGarmentUrl = await preprocessGarmentLengthLocked(
      input.garmentImageUrl
    );

    // --------------------------------------------------
    // 1️⃣ SUBMIT JOB TO FASHN
    // --------------------------------------------------
    const runResponse = await axios.post(
      FASHN_RUN_URL,
      {
        model_name: "tryon-v1.6",
        inputs: {
          model_image: input.modelImageUrl,
          garment_image: finalGarmentUrl,
          category: "one-pieces",
          mode: "quality",
          segmentation_free: false,
          moderation_level: "permissive",
          seed: 42,
          num_samples: 1,
          output_format: "png",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const predictionId = runResponse.data?.id;
    if (!predictionId) {
      throw new Error("FASHN did not return prediction id");
    }

    // --------------------------------------------------
    // 2️⃣ POLL STATUS
    // --------------------------------------------------
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const statusResponse = await axios.get(
        `${FASHN_STATUS_URL}/${predictionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
          },
        }
      );

      const status = statusResponse.data?.status;

      if (status === "completed") {
        return {
          success: true,
          finalImageUrl: statusResponse.data.output[0],
        };
      }

      if (status === "failed") {
        throw new Error(
          JSON.stringify(statusResponse.data.error || "FASHN failed")
        );
      }
    }

    throw new Error("FASHN timeout");
  }
}
