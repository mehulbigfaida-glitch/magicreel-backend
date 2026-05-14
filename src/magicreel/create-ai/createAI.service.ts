import { MUSE_REGISTRY } from "./museRegistry";
import { CreateAIRequest } from "./createAI.types";

export class CreateAIService {
  async generate(input: CreateAIRequest) {
    const muse = MUSE_REGISTRY[input.museId];

    if (!muse) {
      throw new Error("Muse not found");
    }

    return {
      garmentImageUrl: input.garmentImageUrl,

      selectedMuse: input.museId,

      processingImageUrl:
        muse.processingImageUrl,

      status: "ready"
    };
  }
}