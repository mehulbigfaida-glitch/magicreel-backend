// src/services/editorial/engines/filtersEngine.ts
import sharp from "sharp";

/**
 * For now, we keep filters VERY SAFE and minimal so that nothing breaks.
 * Later we can upgrade effects, but right now no sharp({ create }) with bad channels.
 */

export async function applyVignette(
  inputBuffer: Buffer,
  _width: number,
  _height: number,
): Promise<Buffer> {
  // Minimal "soft darken" to simulate mood – but super safe.
  return sharp(inputBuffer).modulate({ brightness: 0.98 }).toBuffer();
}

export async function applyGrain(inputBuffer: Buffer): Promise<Buffer> {
  // No-op for now – return original buffer to avoid noise-generation complexity.
  return inputBuffer;
}
