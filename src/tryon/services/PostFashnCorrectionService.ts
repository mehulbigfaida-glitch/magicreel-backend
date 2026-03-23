import sharp from "sharp";
import axios from "axios";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { EdgeSealService } from "./EdgeSealService";

interface PostCorrectionInput {
  baseImageUrl: string;
  garmentMaskUrl: string;
}

export class PostFashnCorrectionService {
  async correct(input: PostCorrectionInput): Promise<{
    finalImageUrl: string;
  }> {
    // --------------------------------------------------
    // 1️⃣ Download base image
    // --------------------------------------------------
    const baseImageBuffer = Buffer.from(
      (
        await axios.get(input.baseImageUrl, {
          responseType: "arraybuffer",
        })
      ).data
    );

    // --------------------------------------------------
    // 2️⃣ Download garment mask
    // --------------------------------------------------
    const garmentMaskBuffer = Buffer.from(
      (
        await axios.get(input.garmentMaskUrl, {
          responseType: "arraybuffer",
        })
      ).data
    );

    // --------------------------------------------------
    // 3️⃣ Apply garment mask (alpha composite)
    // --------------------------------------------------
    const gravityAdjusted = await sharp(baseImageBuffer)
      .composite([
        {
          input: garmentMaskBuffer,
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    // --------------------------------------------------
    // 4️⃣ EDGE SEAL (POST-OUTPUT POLISH ONLY)
    // --------------------------------------------------
    const sealedBuffer = await EdgeSealService.seal(gravityAdjusted);

    // --------------------------------------------------
    // 5️⃣ Upload final image
    // --------------------------------------------------
    const publicId = crypto.randomUUID();

    const finalUrl: string = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "magicreel/post-corrected",
          public_id: publicId,
          resource_type: "image",
          format: "png",
        },
        (err, res) => {
          if (err || !res) return reject(err);
          resolve(res.secure_url);
        }
      );

      stream.end(sealedBuffer);
    });

    return {
      finalImageUrl: finalUrl,
    };
  }
}
