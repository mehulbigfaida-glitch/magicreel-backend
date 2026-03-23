import Replicate from "replicate";
import { v2 as cloudinary } from "cloudinary";

/**
 * 🔒 BACKEND CLOUDINARY CONFIG (REQUIRED)
 * Frontend config does NOT apply here.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const replicate = new Replicate();

/**
 * Enhance hero image using Replicate Real-ESRGAN (x2)
 * - Includes retry logic for 429 rate limits
 * - Uploads to Cloudinary as hero_preview.png
 */
export async function enhanceHeroImage(params: {
  jobId: string;
  heroBaseUrl: string;
}): Promise<{ heroPreviewUrl: string }> {
  const { jobId, heroBaseUrl } = params;

  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN missing in env");
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary backend env vars missing");
  }

  // 1️⃣ Run ESRGAN with retry logic
  let output: any;

  try {
    output = await replicate.run(
      "nightmareai/real-esrgan",
      {
        input: {
          image: heroBaseUrl,
          scale: 2,
          face_enhance: false,
        },
      }
    );
  } catch (err: any) {
    // Handle rate limit (429)
    if (err?.response?.status === 429) {
      const retryAfter =
        Number(err?.response?.headers?.get?.("retry-after")) || 7;

      console.log(
        `Replicate rate-limited. Retrying in ${retryAfter}s...`
      );

      await new Promise((r) => setTimeout(r, retryAfter * 1000));

      // Retry once
      output = await replicate.run(
        "nightmareai/real-esrgan",
        {
          input: {
            image: heroBaseUrl,
            scale: 2,
            face_enhance: false,
          },
        }
      );
    } else {
      throw err;
    }
  }

  // 2️⃣ Resolve Replicate output URL
  let enhancedImageUrl: string | null = null;

  if (output && typeof output.url === "function") {
    enhancedImageUrl = output.url();
  }

  if (!enhancedImageUrl) {
    throw new Error("ESRGAN returned no output URL");
  }

  // 3️⃣ Download enhanced image
  const response = await fetch(enhancedImageUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download enhanced image (${response.status})`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  // 4️⃣ Upload to Cloudinary as hero_preview.png
  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `magicreel/${jobId}/hero`,
          public_id: "hero_preview",
          overwrite: true,
          resource_type: "image",
          format: "png",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return {
    heroPreviewUrl: uploadResult.secure_url,
  };
}
