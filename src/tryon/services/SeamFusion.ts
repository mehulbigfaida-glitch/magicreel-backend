import sharp from "sharp";

export class SeamFusion {
  static async fuse(
    upper: Buffer,
    lower: Buffer
  ): Promise<Buffer> {
    const upperImg = sharp(upper);
    const u = await upperImg.metadata();
    const l = await sharp(lower).metadata();

    const width = Math.max(u.width ?? 0, l.width ?? 0);

    const upperResized = await upperImg.resize(width).png().toBuffer();
    const lowerResized = await sharp(lower).resize(width).png().toBuffer();

    return sharp({
      create: {
        width,
        height: (u.height ?? 0) + (l.height ?? 0),
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([
        { input: upperResized, top: 0, left: 0 },
        { input: lowerResized, top: u.height ?? 0, left: 0 }
      ])
      .png()
      .toBuffer();
  }
}
