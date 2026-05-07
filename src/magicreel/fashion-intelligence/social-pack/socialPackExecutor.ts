import { buildSocialPackPrompt } from "./socialPackPromptBuilder";
import { retryGenerate } from "./retry";

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

        /* ================= PROMPT BUILD ================= */

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

        /* ================= EXTRACT PROMPT ================= */

        const prompt =
          (payload as any)?.prompt ||
          (payload as any)?.finalPrompt ||
          (payload as any)?.text;

        if (
          !prompt ||
          typeof prompt !== "string"
        ) {
          throw new Error(
            "Invalid prompt generated"
          );
        }

        console.log(
          "SOCIAL PROMPT:",
          prompt
        );

        /* ================= GENERATION ================= */

        const imageUrl =
          await retryGenerate(prompt, {

            // TEMP mapping
            garmentImageUrl:
              inputs.heroImage,

            modelImageUrl:
              inputs.heroImage,
          });

        /* ================= SUCCESS ================= */

        results[goal] = imageUrl;

        successCount++;

      } catch (err: any) {

        console.error(
          `FAILED: ${goal}`,
          err
        );

        /* ================= EXPOSE ERROR ================= */

        results[goal] = {
          success: false,
          error:
            err?.message ||
            "Generation failed",
          stack: err?.stack,
        };
      }
    })
  );

  return {
    results,
    successCount,
  };
}