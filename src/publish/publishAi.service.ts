import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface GenerateContentInput {
  imageUrl: string;
  platform?: "instagram" | "facebook";
  garmentType?: string;
  tone?: string;
}

export interface GenerateContentResult {
  caption: string;
  hashtags: string;
  cta: string;
}

export class PublishAiService {

  async generateContent(
    input: GenerateContentInput
  ): Promise<GenerateContentResult> {

    const platform =
      input.platform || "instagram";

    const tone =
      input.tone || "premium fashion";

    const garmentType =
      input.garmentType || "fashion garment";

    const response =
      await openai.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [

          {
            role: "system",
            content:
`You are MagicReel Fashion AI.

Analyze the fashion image.

Generate:

1. Instagram caption
2. 10-15 hashtags
3. Strong call to action

Rules:

- Fashion focused
- Luxury tone
- No emojis spam
- No markdown
- Return valid JSON only

Format:

{
  "caption": "...",
  "hashtags": "...",
  "cta": "..."
}`
          },

          {
            role: "user",
            content: [

              {
                type: "text",
                text:
`Platform: ${platform}

Tone: ${tone}

Garment Type: ${garmentType}`
              },

              {
                type: "image_url",
                image_url: {
                  url: input.imageUrl
                }
              }

            ]
          }

        ],

        response_format: {
          type: "json_object"
        }

      });

    const raw =
      response.choices[0]
        ?.message
        ?.content || "{}";

    const parsed =
      JSON.parse(raw);

    return {

      caption:
        parsed.caption || "",

      hashtags:
        parsed.hashtags || "",

      cta:
        parsed.cta || ""

    };

  }

}

export const publishAiService =
  new PublishAiService();