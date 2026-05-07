import { buildSocialPackPrompt } from "./socialPackPromptBuilder";
import { generateGeminiCampaignImage } from "../../../magicreel/services/geminiImage.service";

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

        const imageUrl =
  await generateGeminiCampaignImage({

    heroImageUrl:
      inputs.heroImage,

    logoImageUrl:
      inputs.logo,

    prompt,
  });

        results[goal] = imageUrl;

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