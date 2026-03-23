import sharp from "sharp";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

/**
 * Anchor → Volume Transfer Service
 *
 * Goal:
 * - Preserve anchor body volume (hips, thighs, leg separation)
 * - Use FASHN output ONLY for garment texture & layout
 * - Eliminate lower-body collapse (~5–10%)
 */

interface VolumeTransferInput {
  anchorModelUrl: string;
  fashnOutputUrl: string;
}

interface VolumeTransferResult {
  finalUrl: string;
}

export class AnchorVolumeTransferService {
  private outputDir = path.join(
    process.cwd(),
    "storage",
    "tryon",
    "volume-transfer"
  );

  constructor() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async transferVolume(
    input: VolumeTransferInput
  ): Promise<VolumeTransferResult> {
    console.log("🧠 AnchorVolumeTransferService — START");

    const jobId = uuidv4();
    const anchorPath = path.join(this.outputDir, `${jobId}_anchor.png`);
    const fashnPath = path.join(this.outputDir, `${jobId}_fashn.png`);
    const finalPath = path.join(this.outputDir, `${jobId}_final.png`);

    /* -------------------------------------------
       1️⃣ Download anchor & FASHN output
    ------------------------------------------- */
    await this.download(input.anchorModelUrl, anchorPath);
    await this.download(input.fashnOutputUrl, fashnPath);

    /* -------------------------------------------
       2️⃣ Extract anchor silhouette (alpha mask)
       → This locks leg spread, hips, hem width
    ------------------------------------------- */
    const anchorMask = await sharp(anchorPath)
      .resize(1024, 1600)
      .removeAlpha()
      .threshold(245) // aggressive silhouette lock
      .toBuffer();

    /* -------------------------------------------
       3️⃣ Prepare FASHN image (texture source)
    ------------------------------------------- */
    const fashnImage = await sharp(fashnPath)
      .resize(1024, 1600)
      .toBuffer();

    /* -------------------------------------------
       4️⃣ Volume-preserving composite
       - Anchor defines SHAPE
       - FASHN defines TEXTURE
    ------------------------------------------- */
    await sharp(anchorPath)
      .resize(1024, 1600)
      .composite([
        {
          input: fashnImage,
          blend: "over",
        },
        {
          input: anchorMask,
          blend: "dest-in", // 🔥 critical: silhouette lock
        },
      ])
      .png({ quality: 100 })
      .toFile(finalPath);

    /* -------------------------------------------
       5️⃣ Upload / expose final image
       (local URL for now – Cloudinary-ready)
    ------------------------------------------- */
    const finalUrl = `/storage/tryon/volume-transfer/${jobId}_final.png`;

    console.log("✅ Volume transfer complete:", finalUrl);

    return {
      finalUrl,
    };
  }

  /* -------------------------------------------
     Utility: download image
  ------------------------------------------- */
  private async download(url: string, outPath: string) {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(outPath, response.data);
  }
}
