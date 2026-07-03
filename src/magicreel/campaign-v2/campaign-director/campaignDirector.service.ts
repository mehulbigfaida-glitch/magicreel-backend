/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Director Service
 * ============================================================================
 *
 * Responsibility
 * ----------------------------------------------------------------------------
 * Convert campaign inputs and visual intelligence into a Creative Vision.
 *
 * This service MUST NOT:
 * - Generate images
 * - Call Fal
 * - Upload assets
 * - Build image prompts
 * ============================================================================
 */

import OpenAI from "openai";

import {
  CampaignInput,
  CreativeVision,
} from "../types/campaign.types";

import {
  VisualAnalysis,
} from "../visual-intelligence/visual.types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class CampaignDirectorService {

  private readonly model = "gpt-5.5";

  private buildSystemPrompt(): string {
    return `
You are MagicReel Campaign Director.

Your responsibility is to transform product intelligence into a world-class advertising strategy.

You DO NOT generate prompts.

You DO NOT generate marketing copy.

You DO NOT generate images.

Return ONLY valid JSON.

Return exactly these fields:

{
  "creativeDirection":"",
  "composition":"",
  "visualMood":"",
  "hierarchy":"",
  "typographyStyle":"",
  "logoPlacement":""
}
`;
  }

  private buildUserPrompt(
    input: CampaignInput,
    analysis: VisualAnalysis
  ): string {

    return `
Campaign Input

Headline:
${input.headline}

Subheadline:
${input.subheadline ?? ""}

CTA:
${input.cta ?? ""}

Product Category:
${analysis.product.category}

Sub Category:
${analysis.product.subCategory ?? ""}

Garment:
${analysis.product.garmentType ?? ""}

Dominant Colours:
${analysis.colors.dominant.join(", ")}

Accent Colours:
${analysis.colors.accent.join(", ")}

Material:
${analysis.material.primary ?? ""}

Texture:
${analysis.material.texture ?? ""}

Style:
${analysis.styling.style ?? ""}

Occasion:
${analysis.styling.occasion ?? ""}

Luxury Indicators:
${analysis.craftsmanship.luxuryIndicators.join(", ")}

Hero Element:
${analysis.opportunities.heroElement ?? ""}

Strongest Feature:
${analysis.opportunities.strongestVisualFeature ?? ""}
`;
  }

  public async createVision(
    input: CampaignInput,
    analysis: VisualAnalysis
  ): Promise<CreativeVision> {

    const response =
      await client.responses.create({

        model: this.model,

        reasoning: {
          effort: "medium",
        },

        text: {
          verbosity: "low",
        },

        input: [

          {
            role: "system",

            content: [
              {
                type: "input_text",
                text: this.buildSystemPrompt(),
              },
            ],
          },

          {
            role: "user",

            content: [
              {
                type: "input_text",
                text: this.buildUserPrompt(
                  input,
                  analysis
                ),
              },
            ],
          },
        ],
      });

    const raw =
      response.output_text ?? "{}";

    let vision: CreativeVision;

    try {

      vision =
        JSON.parse(raw) as CreativeVision;

    } catch {

      throw new Error(
        "Campaign Director returned invalid JSON."
      );

    }

    this.validate(vision);

    return vision;
  }

  private validate(
    vision: CreativeVision
  ): void {

    const required: (keyof CreativeVision)[] = [

      "creativeDirection",

      "composition",

      "visualMood",

      "hierarchy",

      "typographyStyle",

      "logoPlacement",

    ];

    for (const field of required) {

      const value =
        vision[field];

      if (
        typeof value !== "string" ||
        value.trim().length === 0
      ) {

        throw new Error(
          `Campaign Director missing field: ${field}`
        );

      }
    }
  }

}

export default new CampaignDirectorService();