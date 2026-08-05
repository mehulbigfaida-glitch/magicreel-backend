export interface ImageDimensions {
  width: number;
  height: number;
}

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

  imageSize?:
    | "square_hd"
    | "square"
    | "portrait_4_3"
    | "portrait_16_9"
    | "landscape_4_3"
    | "landscape_16_9"
    | "auto"
    | ImageDimensions;
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