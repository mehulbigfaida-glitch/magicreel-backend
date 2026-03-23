import sharp from "sharp";

export class EdgeSealService {
  static async seal(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .sharpen({ sigma: 0.25 })
      .trim({
        background: { r: 255, g: 255, b: 255, alpha: 0 },
        threshold: 2
      })
      .png()
      .toBuffer();
  }
}
