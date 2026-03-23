import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import "../../config/cloudinary";

/**
 * Purpose:
 * Lock garment silhouette BEFORE FASHN so flare / hem width
 * cannot collapse during try-on.
 */

export interface PreFashnLockResult {
  lockedGarmentUrl: string;
  debug: {
    originalWidth: number;
    originalHeight: number;
    bottomHemWidth: number;
  };
}

export class PreFashnGarmentLockService {
  async lockBeforeFashn(
    garmentImageUrl: string
  ): Promise<PreFashnLockResult> {
    console.log("🔒 Pre-FASHN garment lock started");

    /* -------------------------------------------
       1️⃣ Download original garment
    ------------------------------------------- */
    const response = await fetch(garmentImageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const image = sharp(buffer).ensureAlpha();
    const meta = await image.metadata();

    if (!meta.width || !meta.height) {
      throw new Error("Invalid garment image");
    }

    const width = meta.width;
    const height = meta.height;

    /* -------------------------------------------
       2️⃣ Create binary alpha mask
       (background removal via alpha + threshold)
    ------------------------------------------- */
    const alpha = await image
      .clone()
      .extractChannel("alpha")
      .threshold(10)
      .toBuffer();

    /* -------------------------------------------
       3️⃣ Detect bottom hem width
       (scan lower 15% of image)
    ------------------------------------------- */
    const scanStartY = Math.floor(height * 0.85);
    const scanHeight = height - scanStartY;

    const hemScan = await sharp(alpha)
      .extract({
        left: 0,
        top: scanStartY,
        width,
        height: scanHeight,
      })
      .raw()
      .toBuffer();

    let left = width;
    let right = 0;

    for (let y = 0; y < scanHeight; y++) {
      for (let x = 0; x < width; x++) {
        const val = hemScan[y * width + x];
        if (val > 0) {
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }

    const bottomHemWidth = right - left;

    console.log(
      `📐 Bottom hem width detected: ${bottomHemWidth}px`
    );

    /* -------------------------------------------
       4️⃣ Enforce silhouette
       - Expand alpha mask slightly
       - Prevent inward collapse
    ------------------------------------------- */
    const expandedMask = await sharp(alpha)
      .blur(1.2)
      .threshold(5)
      .toBuffer();

    const lockedImage = await image
      .composite([
        {
          input: expandedMask,
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    /* -------------------------------------------
       5️⃣ Upload locked garment
    ------------------------------------------- */
    const publicId = `locked_${crypto.randomUUID()}`;

    const lockedGarmentUrl = await new Promise<string>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "magicreel/pre_fashn_lock",
            public_id: publicId,
            resource_type: "image",
            format: "png",
          },
          (err, res) => {
            if (err || !res) return reject(err);
            resolve(res.secure_url);
          }
        );
        stream.end(lockedImage);
      }
    );

    console.log("🔒 Pre-FASHN garment locked successfully");

    return {
      lockedGarmentUrl,
      debug: {
        originalWidth: width,
        originalHeight: height,
        bottomHemWidth,
      },
    };
  }
}
