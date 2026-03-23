import sharp from "sharp";

export class UpperBodyCropper {
  // Crops head → mid-thigh for model, neckline → waist for garment
  static async cropModel(input: Buffer): Promise<Buffer> {
    const img = sharp(input);
    const m = await img.metadata();
    const h = m.height ?? 0;

    // head → ~60% height
    const cropHeight = Math.floor(h * 0.6);

    return img.extract({
      left: 0,
      top: 0,
      width: m.width ?? 0,
      height: cropHeight
    }).png().toBuffer();
  }

  static async cropGarmentTop(input: Buffer): Promise<Buffer> {
    const img = sharp(input);
    const m = await img.metadata();
    const h = m.height ?? 0;

    // neckline → waist (~45%)
    const cropHeight = Math.floor(h * 0.45);

    return img.extract({
      left: 0,
      top: 0,
      width: m.width ?? 0,
      height: cropHeight
    }).png().toBuffer();
  }
}
