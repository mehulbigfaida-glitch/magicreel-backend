
import OpenAI from "openai";

import {
  VisualAnalysis,
  VisualIntelligenceResult,
} from "./visual.types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class VisualIntelligenceService {
  private readonly model = "gpt-5.5";

private buildSystemPrompt(): string {
  return `
You are MagicReel Visual Intelligence Engine.

Your ONLY responsibility is to analyse a fashion product image.

You MUST return ONLY valid JSON.

Never explain.

Never write markdown.

Never write prose.

Never invent fields.

Populate every field.

If unknown, return null.

If an array is unknown, return [].

Return EXACTLY this JSON structure:

{
  "product":{
    "category":"",
    "subCategory":"",
    "garmentType":"",
    "gender":"",
    "ageGroup":"",
    "usage":""
  },

  "colors":{
    "dominant":[],
    "secondary":[],
    "accent":[],
    "harmony":"",
    "temperature":"",
    "saturation":"",
    "contrast":""
  },

  "material":{
    "primary":"",
    "secondary":[],
    "texture":"",
    "finish":"",
    "transparency":"",
    "reflectivity":"",
    "drape":""
  },

  "construction":{
    "silhouette":"",
    "neckline":"",
    "sleeve":"",
    "hemline":"",
    "waistline":"",
    "closure":"",
    "fit":""
  },

  "silhouette":{
    "shape":"",
    "volume":"",
    "balance":"",
    "structure":"",
    "movement":""
  },

  "styling":{
    "style":"",
    "occasion":"",
    "season":"",
    "layering":"",
    "accessoriesDetected":[],
    "stylingKeywords":[]
  },

  "branding":{
    "visibleLogo":false,
    "logoPosition":"",
    "brandElements":[],
    "signatureDetails":[]
  },

  "craftsmanship":{
    "embroidery":"",
    "embellishments":[],
    "stitching":"",
    "print":"",
    "pattern":"",
    "luxuryIndicators":[],
    "handcraftedElements":[]
  },

  "composition":{
    "focalPoint":"",
    "visualWeight":"",
    "symmetry":"",
    "balance":"",
    "dominantShape":"",
    "repeatingPatterns":[]
  },

  "quality":{
    "perceivedLuxury":"",
    "premiumScore":0,
    "craftsmanshipScore":0,
    "visualComplexity":0,
    "productionReadiness":0,
    "confidence":0
  },

  "opportunities":{
    "heroElement":"",
    "strongestVisualFeature":"",
    "supportingFeatures":[],
    "luxuryHighlights":[],
    "recommendedFocus":[],
    "preserveElements":[],
    "avoidChanges":[]
  }
}
`;
}

  async analyzeProduct(
    imageUrl: string
  ): Promise<VisualIntelligenceResult> {
    const started = Date.now();

    const response = await client.responses.create({
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
              text: `
Analyze this product image and produce a complete visual analysis.
              `,
            },
            {
  type: "input_image",
  image_url: imageUrl,
  detail: "high",
}
          ],
        },
      ],
    });

    let raw = response.output_text ?? "{}";

let analysis: VisualAnalysis;

try {
  analysis = JSON.parse(raw) as VisualAnalysis;
} catch (error) {
  throw new Error(
    `Visual Intelligence returned invalid JSON.\n\n${raw}`
  );
}

return {
  success: true,
  analysis,
  processingTime: Date.now() - started,
  engine: "gpt-5.5",
  version: "2.0",
};
  }
}

export default new VisualIntelligenceService();