import sharp from "sharp";

export class BottomReconstructor {
  // Scales original skirt so waist matches bodice waist
  static async reconstruct(
    originalGarment: Buffer,
    targetWaistPx: number
  ): Promise<Buffer> {
    const img = sharp(originalGarment);
    const m = await img.metadata();

    const origWidth = m.width ?? 1;
    const scale = targetWaistPx / origWidth;

    return img
      .resize(Math.round(origWidth * scale))
      .png()
      .toBuffer();
  }
}
