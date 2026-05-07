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
  const results: Record<string, string> = {};
  let successCount = 0;

  await Promise.all(
    outputs.map(async (goal) => {
      try {
        /* ================= PROMPT BUILD ================= */

        const payload = buildSocialPackPrompt({
          ...inputs,
          creativeGoal: goal,
        });

        // 🔥 Extract string from Gemini-style payload
        const prompt =
          (payload as any)?.prompt ||
          (payload as any)?.finalPrompt ||
          (payload as any)?.text;

        if (!prompt || typeof prompt !== "string") {
          throw new Error("Invalid prompt generated");
        }

        /* ================= GENERATION ================= */

        const imageUrl = await retryGenerate(prompt, {
          // 🔥 TEMP mapping (we refine later)
          garmentImageUrl: inputs.heroImage,
          modelImageUrl: inputs.heroImage,
        });

        results[goal] = imageUrl;
        successCount++;
      } catch (err) {
        console.error(`FAILED: ${goal}`, err);
      }
    })
  );

  return {
    results,
    successCount,
  };
}