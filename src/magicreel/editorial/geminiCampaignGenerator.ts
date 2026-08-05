import {
  falImageProvider,
} from "../services/image-generation/providers/fal.provider";

interface GenerateGeminiCampaignImageInput {
  prompt: string;

  heroImageUrl: string;

  logoImageUrl?: string;
}

export interface GeneratedCampaignImage {
  imageUrl: string;

  prompt: string;
}

export async function generateGeminiCampaignImage(
  input: GenerateGeminiCampaignImageInput
): Promise<GeneratedCampaignImage> {

  const result =
    await falImageProvider.generateEditedImages({

      prompt: input.prompt,

      referenceImages: [

        input.heroImageUrl,

        ...(input.logoImageUrl
          ? [input.logoImageUrl]
          : []),

      ],

      numImages: 1,

      outputFormat: "png",

      quality: "medium",
    });

  const image =
    result.images[0];

  if (!image) {
    throw new Error(
      "Fal returned no generated images."
    );
  }

  return {

    imageUrl: image.url,

    prompt: input.prompt,
  };
}