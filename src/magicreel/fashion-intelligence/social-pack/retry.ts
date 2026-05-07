import { FashnService } from "../../services/fashn.service";

const fashn = new FashnService();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryGenerate(
  prompt: string,
  inputs: {
    garmentImageUrl: string;
    modelImageUrl: string;
  },
  retries = 2
): Promise<string> {
  try {
    const runId = await fashn.runProductToModel({
      garmentImageUrl: inputs.garmentImageUrl,
      modelImageUrl: inputs.modelImageUrl,
      prompt,
    });

    const maxAttempts = 20;

    for (let i = 0; i < maxAttempts; i++) {
      const status = await fashn.pollStatus(runId);

      if (status.status === "completed" && status.output?.length) {
        return status.output[0];
      }

      if (status.status === "failed") {
        throw new Error(status.error || "FASHN failed");
      }

      await sleep(1500);
    }

    throw new Error("FASHN timeout");
  } catch (err) {
    if (retries === 0) throw err;

    console.warn("Retrying generation...");
    return retryGenerate(prompt, inputs, retries - 1);
  }
}