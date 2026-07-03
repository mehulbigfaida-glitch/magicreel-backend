// src/magicreel/services/image-generation/imageGeneration.service.ts

import {
  GenerateEditedImageRequest,
  GenerateEditedImageResponse,
} from "./imageGeneration.types";

import { falImageProvider } from "./providers/fal.provider";

export class ImageGenerationService {
  public async generateEditedImages(
    request: GenerateEditedImageRequest
  ): Promise<GenerateEditedImageResponse> {
    return falImageProvider.generateEditedImages(request);
  }
}

export const imageGenerationService =
  new ImageGenerationService();