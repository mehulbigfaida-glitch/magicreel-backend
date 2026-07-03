import { buildSocialPackPrompt } from "./socialPackPromptBuilder";
import { imageGenerationService } from "../../services/image-generation/imageGeneration.service";
type Args = {
  outputs: string[];
  inputs: any;
};

export async function generateSocialPackExecutor({
  outputs,
  inputs,
}: Args) {

  const results: Record<string, any> = {};

  let successCount = 0;

  await Promise.all(

    outputs.map(async (goal) => {

      try {

        const normalizedCreativeDirection =
          typeof inputs.creativeDirection ===
          "string"
            ? inputs.creativeDirection
            : "Luxury Editorial";

        const payload =
          buildSocialPackPrompt({
            ...inputs,
            creativeDirection:
              normalizedCreativeDirection,
            creativeGoal: goal,
          });

        const systemPrompt =
          (payload as any)?.systemPrompt || "";

        const userPrompt =
          (payload as any)?.userPrompt || "";

        const prompt = `
${systemPrompt}

${userPrompt}
        `.trim();

        if (!prompt) {
          throw new Error(
            "Invalid prompt generated"
          );
        }

        console.log(
          "SOCIAL PACK PROMPT:",
          prompt
        );

        const response =
  await imageGenerationService.generateEditedImages({
    referenceImages: [
      inputs.heroImage,
      inputs.logo,
    ].filter((url): url is string => !!url),
    prompt,
    quality: "medium",
    numImages: 1,
    outputFormat: "png",
  });
  
results[goal] = response.images[0]?.url;

        successCount++;

      } catch (err: any) {

        console.error(
          `FAILED: ${goal}`,
          err
        );

        results[goal] = {
          success: false,
          error:
            err?.message ||
            "Generation failed",
        };
      }
    })
  );

  return {
    results,
    successCount,
  };
}