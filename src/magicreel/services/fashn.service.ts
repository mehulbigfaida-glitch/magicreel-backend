import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { RenderJob } from "../schema";

const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";
const FASHN_API_KEY = process.env.FASHN_API_KEY as string;

if (!FASHN_API_KEY) {
  throw new Error("FASHN_API_KEY is not set");
}

/**
 * Cloudinary Configuration
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
});

export interface FashnStatusResult {
  status: "pending" | "running" | "completed" | "failed";
  output?: string[];
  error?: string;
}

/**
 * FashnService
 * --------------------------------
 * Canonical FASHN orchestrator for MagicReel
 *
 * Responsibilities:
 * - Execute Product-to-Model job
 * - Poll FASHN status
 * - Intercept vendor image
 * - Upload image to Cloudinary
 * - Return secure MagicReel image URL
 */
export class FashnService {

  /**
   * Execute Product-to-Model render
   * Returns runId
   */
  async runProductToModel(job: RenderJob): Promise<string> {
    const response = await axios.post(
      FASHN_RUN_URL,
      {
        model_name: "product-to-model",
        inputs: {
          product_image: job.garmentImageUrl,
          model_image: job.modelImageUrl,
          prompt: job.prompt,
          output_format: "png",
          return_base64: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${FASHN_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.data?.id) {
      throw new Error("FASHN did not return runId");
    }

    return response.data.id;
  }

  /**
   * Upload image to Cloudinary
   */
  private async uploadToCloudinary(imageUrl: string): Promise<string> {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "magicreel/heroes",
      resource_type: "image",
      format: "png"
    });

    if (!result.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    return result.secure_url;
  }

  /**
   * Poll FASHN job status
   * Intercepts vendor image when complete
   */
  async pollStatus(runId: string): Promise<FashnStatusResult> {

    const response = await axios.get<FashnStatusResult>(
      `${FASHN_STATUS_URL}/${runId}`,
      {
        headers: {
          Authorization: `Bearer ${FASHN_API_KEY}`
        }
      }
    );

    const data = response.data;

    /**
     * When job completes
     * Intercept vendor CDN image
     * Upload to Cloudinary
     */
    if (data.status === "completed" && data.output?.length) {

      const vendorImageUrl = data.output[0];

      try {
        const cloudinaryUrl = await this.uploadToCloudinary(vendorImageUrl);

        return {
          status: "completed",
          output: [cloudinaryUrl]
        };

      } catch (error) {

        console.error("Cloudinary upload failed:", error);

        return {
          status: "failed",
          error: "Cloudinary upload failed"
        };
      }
    }

    return data;
  }
}
