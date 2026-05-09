import {
  buildEditorialPrompt,
  CampaignOutput,
  EditorialWorld,
} from "./editorialPromptEngine";

interface BuildCampaignOutputsInput {
  editorialWorld: EditorialWorld;

  outputs: CampaignOutput[];
}

export interface CampaignOutputPrompt {
  output: CampaignOutput;

  prompt: string;
}

export function buildCampaignOutputs(
  input: BuildCampaignOutputsInput
): CampaignOutputPrompt[] {
  return input.outputs.map((output) => {
    const prompt =
      buildEditorialPrompt({
        editorialWorld:
          input.editorialWorld,

        output,
      });

    return {
      output,
      prompt,
    };
  });
}