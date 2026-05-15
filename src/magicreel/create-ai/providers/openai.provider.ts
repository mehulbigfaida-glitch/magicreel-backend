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
    const prompt = buildCreateAIPrompt();

    console.log("[CREATE AI GENERATING]");

    console.log({
      garment: input.garmentImageUrl,
      muse: input.processingImageUrl,
    });

    // TEMP: validate OpenAI connection first
    // actual image parsing comes after response inspection

    const response = await client.responses.create({
      model: "gpt-4.1-mini",

      input: `${prompt}

Garment image:
${input.garmentImageUrl}

Muse image:
${input.processingImageUrl}`
    });

    return {
      success: true,

      engine: "openai",

      output: response.output_text
    };
  }
}