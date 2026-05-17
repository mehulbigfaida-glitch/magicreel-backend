import "dotenv/config";
import OpenAI from "openai";
import { buildCreateAIPrompt } from "../createAI.prompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIProvider {
  async generate(input: {
    garmentImageUrl: string;
    processingImageUrl: string;
  }) {

    const prompt =
      buildCreateAIPrompt();

    console.log(
      "[CREATE AI GENERATING]"
    );

    console.log({
      garment:
        input.garmentImageUrl,

      muse:
        input.processingImageUrl
    });

    const result =
      await client.images.generate({

        model:
          "gpt-image-2",

        size:
          "1024x1280",

        quality:
          "high",

        prompt:`

${prompt}

Garment image:
${input.garmentImageUrl}

Muse image:
${input.processingImageUrl}

Create a premium luxury fashion hero.

STRICT RULES:

- exact 4:5 portrait composition
- full body visible from head to feet
- centered symmetrical framing
- preserve muse identity
- preserve anatomy
- preserve garment identity
- preserve textile details
- premium studio background
- realistic fashion campaign photography
- ultra detailed skin
- premium DSLR realism

`
      });

    console.log(
      "[OPENAI IMAGE RAW]",
      JSON.stringify(
        result,
        null,
        2
      )
    );

    const imageBase64 =
      result?.data?.[0]?.b64_json;

    if(
      !imageBase64
    ){

      console.error(
        "[OPENAI NO IMAGE]",
        result
      );

      throw new Error(
        "No image returned from OpenAI"
      );
    }

    return {

      success:true,

      engine:"openai",

      output:
        `data:image/png;base64,${imageBase64}`

    };

  }
}