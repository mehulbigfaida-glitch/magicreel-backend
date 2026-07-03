/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * GPT Client
 * ============================================================================
 *
 * Responsibility:
 * - Communicate with GPT
 * - Enforce JSON responses
 * - Parse responses
 * - Handle provider errors
 *
 * This file MUST NOT contain campaign-specific logic.
 * ============================================================================
 */

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class GptClient {
  /**
   * Sends a system prompt and user prompt to GPT
   * and returns parsed JSON.
   */
  public async generateJson<T>(
    systemPrompt: string,
    userPrompt: string
  ): Promise<T> {
    try {
      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL ?? "gpt-5.5",

        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: systemPrompt,
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: userPrompt,
              },
            ],
          },
        ],

        reasoning: {
  effort: "medium",
},

text: {
  verbosity: "low",

  format: {
    type: "json_object",
  },
},
      });

      const text = response.output_text?.trim();

      if (!text) {
        throw new Error("GPT returned an empty response.");
      }

      return JSON.parse(text) as T;
    } catch (error) {
      console.error("GPT Client Error:", error);

      throw new Error("Failed to generate GPT response.");
    }
  }
}

export const gptClient = new GptClient();