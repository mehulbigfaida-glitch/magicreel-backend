import crypto from "crypto";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import "../../config/cloudinary";

export type AvatarId = "riya" | "pooja" | "aananya" | "generic";

async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        format: "png",
      },
      (err, res) => {
        if (err || !res) return reject(err);
        resolve(res.secure_url);
      }
    );
    stream.end(buffer);
  });
}

/**
 * 🔒 LENGTH-LOCKED GARMENT PREPROCESS (v2)
 */
export async function preprocessGarmentForAvatar(
  garmentUrl: string,
  _avatarId: AvatarId = "generic"
): Promise<string> {
  console.log("👗 [Garment Preprocess v2] START:", garmentUrl);

  try {
    // 1️⃣ Download garment as BUFFER (TYPE-SAFE)
    const response = await fetch(garmentUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buf = Buffer.from(new Uint8Array(arrayBuffer));

    // 2️⃣ Resize garment (width constrained, height free)
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
          gravity: "south", // hem anchored
        },
      ])
      .png()
      .toBuffer();

    // 4️⃣ Upload
    const id = crypto.randomUUID();
    const url = await uploadBufferToCloudinary(
      padded,
      "magicreel/preprocessed-garments",
      id
    );

    console.log("✅ Garment length locked:", url);
    return url;
  } catch (err) {
    console.error("❌ Garment preprocess failed:", err);
    return garmentUrl;
  }
}
