import { MUSE_REGISTRY } from "./museRegistry";
import { CreateAIRequest } from "./createAI.types";
import { OpenAIProvider } from "./providers/openai.provider";

const openai = new OpenAIProvider();

export class CreateAIService {
  async generate(input: CreateAIRequest) {
    const muse =
      MUSE_REGISTRY[input.museId];

    if (!muse) {
      throw new Error(
        "Muse not found"
      );
    }

    const result =
      await openai.generate({

        garmentImageUrl:
          input.garmentImageUrl,

        processingImageUrl:
          muse.processingImageUrl

      });

    return result;
  }
}