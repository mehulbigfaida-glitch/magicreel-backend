import { buildCreativePlan } from "../fashion-intelligence/planning/creativePlanBuilder";
import { translateToGPTImagePrompt } from "../fashion-intelligence/translators/gptImageTranslator";
import { imageGenerationService } from "../services/image-generation/imageGeneration.service";
import { PromptContext } from "../fashion-intelligence/types/context.types";

type EditorialCampaignInput = {
  heroImageUrl: string;
  logoImageUrl?: string;
  context: PromptContext;
};

export async function generateEditorialCampaign(
  input: EditorialCampaignInput
): Promise<string> {

  const plan = buildCreativePlan(input.context);

  const shots = [
  {
    name: "Campaign Hero",
    instruction:
      "Create the definitive hero image of the campaign. Strong editorial composition. The model looks directly at the camera. The garment remains the dominant subject."
  },
  {
    name: "Architectural Editorial",
    instruction:
      "Showcase the surrounding luxury architecture. Use pillars, arches, leading lines and depth while keeping the garment as the primary focus."
  },
  {
    name: "Luxury Lifestyle",
    instruction:
      "Create a natural luxury fashion moment with subtle interaction with the environment. The pose should feel relaxed, elegant and effortless."
  },
  {
    name: "Cinematic Finale",
    instruction:
      "Create the emotional climax of the campaign using dramatic lighting, atmosphere and storytelling while preserving the garment exactly."
  }
];
  
  const shot = shots[0];

const prompt =
  `${translateToGPTImagePrompt(plan)}

==================================================
CAMPAIGN SHOT
==================================================

${shot.name}

${shot.instruction}`;

  console.log("=================================");
  console.log("EDITORIAL CREATIVE PLAN");
  console.dir(plan, { depth: null });

  console.log("=================================");
  console.log("EDITORIAL GPT PROMPT");
  console.log(prompt);

 const response =
  await imageGenerationService.generateEditedImages({
    referenceImages: [
      input.heroImageUrl,
      input.logoImageUrl,
    ].filter((url): url is string => !!url),
    prompt,
    quality: "medium",
    numImages: 1,
    outputFormat: "png",
  });

  if (!response.images.length) {
    throw new Error(
      "No editorial image returned."
    );
  }

  return response.images[0].url;
}