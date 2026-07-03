import dotenv from "dotenv";

dotenv.config();

import OpenAI from "openai";

import { buildCreativeDecisionPrompt } from "./creativeDecisionPrompt";
import { parseCreativeDecision } from "./creativeDecisionParser";
import { CreativeDecision } from "./creativeDecision.types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateCreativeDecisionInput {

  heroImageUrl: string;

  communication: string;

  headline?: string;

  subheadline?: string;

  cta?: string;

}

export class CreativeDecisionService {

  async generateDecision(
    input: GenerateCreativeDecisionInput
  ): Promise<CreativeDecision> {

    const response =
      await openai.chat.completions.create({

        model: "gpt-4.1-mini",

        response_format: {
          type: "json_object",
        },

        messages: [

          {
            role: "system",

            content:
              buildCreativeDecisionPrompt(),
          },

          {
            role: "user",

            content: [

              {
                type: "text",

                text:

`Communication:
${input.communication}

Headline:
${input.headline ?? ""}

Subheadline:
${input.subheadline ?? ""}

CTA:
${input.cta ?? ""}`
              },

              {
                type: "image_url",

                image_url: {
                  url: input.heroImageUrl,
                },
              },

            ],
          },

        ],

      });

    const raw =
      response.choices[0]
        ?.message
        ?.content ?? "{}";

    return parseCreativeDecision(raw);

  }

}

export const creativeDecisionService =
  new CreativeDecisionService();