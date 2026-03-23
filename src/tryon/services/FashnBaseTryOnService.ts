import axios from "axios";
import sharp from "sharp";

const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";

const MIN_GARMENT_HEIGHT_RATIO = 0.78;
const MAX_RETRIES = 1;

export interface FashnTryOnInput {
  modelImageUrl: string;
  garmentImageUrl: string;
  category?: "auto" | "tops" | "bottoms" | "one-pieces";
  garmentPhotoType?: "auto" | "model" | "flat-lay";
  segmentationFree?: boolean;
}

export class FashnBaseTryOnService {
  /* ---------------- START (async) ---------------- */
  async startBaseTryOn(input: FashnTryOnInput): Promise<{ predictionId: string }> {
    const response = await axios.post(
      FASHN_RUN_URL,
      {
        model_name: "tryon-v1.6",
        inputs: {
          model_image: input.modelImageUrl,
          garment_image: input.garmentImageUrl,
          category: input.category ?? "auto",
          garment_photo_type: input.garmentPhotoType ?? "auto",
          segmentation_free: input.segmentationFree ?? true,
          mode: "quality",
          num_samples: 1,
          output_format: "png",
          moderation_level: "permissive",
          seed: 42,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data?.id) {
      throw new Error("FASHN did not return prediction ID");
    }

    return { predictionId: response.data.id };
  }

  /* ---------------- POLL RESULT ---------------- */
  async pollBaseTryOn(
    predictionId: string
  ): Promise<{ imageUrl: string; garmentHeightRatio: number }> {
    const statusResponse = await axios.get(
      `${FASHN_STATUS_URL}/${predictionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
        },
      }
    );

    const status = statusResponse.data?.status;

    if (status === "failed") {
      throw new Error(
        JSON.stringify(statusResponse.data?.error || "FASHN failed")
      );
    }

    if (status !== "completed") {
      throw new Error("NOT_READY");
    }

    const imageUrl = statusResponse.data?.output?.[0];
    if (!imageUrl) {
      throw new Error("FASHN completed without output");
    }

    const ratio = await this.measureGarmentHeightRatio(imageUrl);

    return {
      imageUrl,
      garmentHeightRatio: ratio,
    };
  }

  /* ---------------- GEOMETRY CHECK ---------------- */
  private async measureGarmentHeightRatio(imageUrl: string): Promise<number> {
    const res = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
    });

    const img = sharp(Buffer.from(res.data)).ensureAlpha();
    const meta = await img.metadata();
    if (!meta.width || !meta.height) return 0;

    const { data, info } = await img
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    const BG_THRESHOLD = 245;

    let bottomRow = -1;

    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (data[idx] < BG_THRESHOLD) {
          bottomRow = y;
          break;
        }
      }
      if (bottomRow !== -1) break;
    }

    if (bottomRow < 0) return 0;
    return (bottomRow + 1) / height;
  }
}
