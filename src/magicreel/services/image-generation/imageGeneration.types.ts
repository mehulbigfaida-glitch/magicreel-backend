export type ImageGenerationQuality =
  | "low"
  | "medium"
  | "high"
  | "auto";

export interface GenerateEditedImageRequest {
  /**
   * Complete creative instruction
   */
  prompt: string;

  /**
   * Reference images supplied to the AI model.
   *
   * Examples:
   *
   * Campaign:
   *  Hero
   *  Logo
   *  Asset1
   *  Asset2
   *  Asset3
   *  Asset4
   *
   * Hero:
   *  Hero
   *  Logo
   *
   * Editorial:
   *  Hero
   *  Moodboard
   *  Lighting
   *
   */
  referenceImages: string[];

  quality?: ImageGenerationQuality;

  numImages?: number;

  outputFormat?: "png" | "jpeg" | "webp";
}

export interface GeneratedImage {
  url: string;

  width?: number;

  height?: number;

  contentType?: string;

  fileName?: string;
}

export interface GenerateEditedImageResponse {
  images: GeneratedImage[];
}