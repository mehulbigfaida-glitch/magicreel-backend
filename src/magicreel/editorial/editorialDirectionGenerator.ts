import {
  buildEditorialDraftPrompt,
} from "./editorialDraftPrompt";

import {
  generateGeminiCampaignImage,
} from "../services/geminiImage.service";

interface GenerateEditorialDirectionInput {
  heroImageUrl: string;

  logoImageUrl?: string;

  editorialWorld: string;

  output: string;
}

export async function generateEditorialDirection(
  input: GenerateEditorialDirectionInput
) {

  const prompt =
    buildEditorialDraftPrompt({
      editorialWorld:
        input.editorialWorld,

      output:
        input.output,
    });

  const imageUrl =
    await generateGeminiCampaignImage({

      heroImageUrl:
        input.heroImageUrl,

      logoImageUrl:
        input.logoImageUrl,

      prompt,
    });

  return {
    imageUrl,

    prompt,
  };
}