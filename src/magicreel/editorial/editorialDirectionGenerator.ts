import {
  EditorialPromptBuilder,
} from "./builder/EditorialPromptBuilder";

import {
  getOutputProfile,
} from "./registry/outputProfiles";

import {
  falImageProvider,
} from "../services/image-generation/providers/fal.provider";

interface GenerateEditorialDirectionInput {
  heroImageUrl: string;

  logoImageUrl?: string;

  additionalImageUrls?: string[];

  editorialWorld: string;

  output: string;
}

export async function generateEditorialDirection(
  input: GenerateEditorialDirectionInput
) {

  const builder =
  new EditorialPromptBuilder();

const outputProfile =
  getOutputProfile(
    input.output
  );

const prompt =
  builder.build({

    worldId:
      input.editorialWorld,

    output:
      outputProfile,

  });

  const result =
  await falImageProvider.generateEditedImages({

    prompt,

    referenceImages: [

  input.heroImageUrl,

  ...(input.additionalImageUrls ?? []),

],

    numImages: 1,

    outputFormat: "png",

imageSize: outputProfile.imageSize,

quality: "medium",
  });

const imageUrl =
  result.images[0].url;

  return {
    imageUrl,

    prompt,
  };
}