import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import "../../config/cloudinary";

/* --------------------------------------------------
   TYPES
-------------------------------------------------- */

export interface GarmentGeometry {
  width: number;
  height: number;
  bbox: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  maskUrl: string;
}

/* --------------------------------------------------
   SERVICE
-------------------------------------------------- */

export class GarmentLockService {
  /**
   * STEP A:
   * Extract garment silhouette & geometry
   * from ORIGINAL garment image
   */
  async extractGarmentGeometry(
    garmentImageUrl: string
  ): Promise<GarmentGeometry> {
    // 1️⃣ Download garment image
    const response = await fetch(garmentImageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const image = sharp(buffer).ensureAlpha();
    const meta = await image.metadata();

    if (!meta.width || !meta.height) {
      throw new Error("Invalid garment image");
    }

    // 2️⃣ Create garment mask
    const grayscale = await image.clone().grayscale().toBuffer();

    const rawMask = await sharp(grayscale)
      .threshold(245)
      .negate()
      .blur(1)
      .toColourspace("b-w")
      .toBuffer();

    // 3️⃣ Trim to bounding box
    const trimmed = await sharp(rawMask).trim().toBuffer();
    const trimmedMeta = await sharp(trimmed).metadata();

    if (!trimmedMeta.width || !trimmedMeta.height) {
      throw new Error("Failed to extract garment mask");
    }

    const left =
      (meta.width - trimmedMeta.width) / 2;
    const top =
      (meta.height - trimmedMeta.height) / 2;

    const bbox = {
      left: Math.max(0, Math.round(left)),
      top: Math.max(0, Math.round(top)),
      right: Math.round(left + trimmedMeta.width),
      bottom: Math.round(top + trimmedMeta.height),
    };

    // 4️⃣ Upload mask
    const id = crypto.randomUUID();

    const maskUrl = await new Promise<string>(
      (resolve, reject) => {
        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "magicreel/garment-geometry",
              public_id: `${id}_mask`,
              resource_type: "image",
              format: "png",
            },
            (err, res) => {
              if (err || !res)
                return reject(err);
              resolve(res.secure_url);
            }
          );
        stream.end(rawMask);
      }
    );

    return {
      width: trimmedMeta.width,
      height: trimmedMeta.height,
      bbox,
      maskUrl,
    };
  }

  /**
   * STEP B:
   * Enforce garment geometry AFTER FASHN
   */
  async enforceGeometry(
    fashnOutputUrl: string,
    geometry: GarmentGeometry
  ): Promise<string> {
    // 1️⃣ Download FASHN output
    const response = await fetch(fashnOutputUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    const fashnImage = sharp(buffer).ensureAlpha();
    const meta = await fashnImage.metadata();

    if (!meta.width || !meta.height) {
      throw new Error("Invalid FASHN output image");
    }

    // 2️⃣ Restore global garment size
    const corrected = await fashnImage
      .resize({
        width: geometry.width,
        height: geometry.height,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    // 3️⃣ Upload corrected image
    const id = crypto.randomUUID();

    const correctedUrl = await new Promise<string>(
      (resolve, reject) => {
        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "magicreel/garment-locked",
              public_id: `${id}_locked`,
              resource_type: "image",
              format: "png",
            },
            (err, res) => {
              if (err || !res)
                return reject(err);
              resolve(res.secure_url);
            }
          );
        stream.end(corrected);
      }
    );

    return correctedUrl;
  }
}
