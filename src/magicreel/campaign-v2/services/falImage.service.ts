/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * FAL Image Service
 * ============================================================================
 */

import {
  CampaignImageGenerationInput,
} from "../types/campaign.types";

import { falImageProvider } from "../../services/image-generation/providers/fal.provider";

export class FalImageService {
  public async generateCampaignImage(
    input: CampaignImageGenerationInput
  ): Promise<string> {

    console.log("========== STEP 3 ==========");
    console.log(JSON.stringify(input, null, 2));
    console.log("============================");

    if (!input) {
      throw new Error("FalImageService received undefined input.");
    }

    if (!input.imageRequest) {
      throw new Error(
        "FalImageService received input without imageRequest."
      );
    }

    const { systemPrompt, userPrompt } = input.imageRequest;

    const response =
      await falImageProvider.generateEditedImages({
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        referenceImages: input.referenceImages,
        numImages: 1,
        outputFormat: "png",
        quality: "medium",
      });

    if (!response.images || response.images.length === 0) {
      throw new Error("FAL returned no campaign image.");
    }

    console.log("✅ Campaign image generated.");
    console.log(response.images[0].url);

    return response.images[0].url;
  }
}