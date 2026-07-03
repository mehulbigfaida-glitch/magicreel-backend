/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Prompt Builder Service
 * ============================================================================
 *
 * Responsibility:
 * ---------------------------------------------------------------------------
 * Convert Creative Direction into the final image generation prompt.
 *
 * This service MUST NOT:
 * - Generate images
 * - Call GPT
 * - Perform visual analysis
 * - Upload assets
 * ============================================================================
 */

import {
  CampaignInput,
  CreativeVision,
  ImageGenerationRequest,
} from "../types/campaign.types";

import {
  CreativeDirection,
} from "../creative-director/creativeDirector.service";

export class PromptBuilderService {
  public buildPrompt(
    input: CampaignInput,
    vision: CreativeVision,
    direction: CreativeDirection
  ): ImageGenerationRequest {

    const systemPrompt = this.buildSystemPrompt();

    const userPrompt = this.buildUserPrompt(
      input,
      vision,
      direction
    );

    return {
      systemPrompt,
      userPrompt,
    };
  }

  /**
   * --------------------------------------------------------------------------
   * Stable system prompt
   * --------------------------------------------------------------------------
   */

  private buildSystemPrompt(): string {

    return `
You are MagicReel Campaign Image Generator.

Your objective is to create a world-class advertising campaign image.

Rules:

• Preserve the uploaded product exactly.
• Never redesign the product.
• Never modify branding.
• Never modify logos.
• Produce premium commercial quality.
• Photorealistic.
• Luxury advertising.
• Studio quality.
• Output one final campaign image.
`;
  }

  /**
   * --------------------------------------------------------------------------
   * Dynamic prompt
   * --------------------------------------------------------------------------
   */

  private buildUserPrompt(
    input: CampaignInput,
    vision: CreativeVision,
    direction: CreativeDirection
  ): string {

    const lines: string[] = [];

lines.push("Reference Image Instructions");

lines.push(
  "Use every supplied reference image as mandatory visual input for the final campaign."
);

lines.push(
  "Reference Image 1 defines the primary campaign subject and overall composition."
);

if (input.supportingHeroUrls.length > 0) {

  lines.push(
    `Reference Images 2-${input.supportingHeroUrls.length + 1} each contain additional approved Hero assets that MUST appear in the final campaign image.`
  );

  lines.push(
    "Every supplied Hero asset must be visible in the final composition."
  );

  lines.push(
    "Arrange all Hero subjects naturally into one premium fashion advertising campaign."
  );

  lines.push(
    "Preserve every garment exactly as shown in its own reference image, including colours, embroidery, fabric texture, silhouette and styling."
  );

  lines.push(
    "Do not redesign, merge, replace or omit any Hero asset."
  );

  lines.push(
    "Each Hero asset must remain individually recognizable."
  );
}

if (input.logoUrl) {

  lines.push(
    "The final reference image contains the official brand logo."
  );

  lines.push(
    "Reproduce the logo exactly without modification and integrate it elegantly into the campaign layout."
  );
}

lines.push("");

    lines.push("Campaign Objective");
    lines.push(vision.creativeDirection);
    lines.push("");

    lines.push("Composition");
    lines.push(direction.compositionDirection);
    lines.push("");

    lines.push("Visual Mood");
    lines.push(direction.emotionalTone);
    lines.push("");

    lines.push("Typography");
    lines.push(direction.typographyDirection);
    lines.push("");

    lines.push("Headline");
    lines.push(input.headline);

    if (input.subheadline) {
      lines.push("");
      lines.push("Subheadline");
      lines.push(input.subheadline);
    }

    if (input.cta) {
      lines.push("");
      lines.push("Call To Action");
      lines.push(input.cta);
    }

    lines.push("");
    lines.push("Headline Treatment");
    lines.push(direction.headlineTreatment);

    lines.push("");
    lines.push("Background");
    lines.push(direction.backgroundDirection);

    lines.push("");
    lines.push("Lighting");
    lines.push(direction.lightingDirection);

    lines.push("");
    lines.push("Colour Direction");
    lines.push(direction.colorDirection);

    lines.push("");
    lines.push("Branding");
    lines.push(direction.brandingDirection);

    lines.push("");
    lines.push("Rendering");
    lines.push(direction.renderingStyle);

    lines.push("");
    lines.push("Product");
    lines.push(direction.productPriority);

    return lines.join("\n");
  }
}

export default new PromptBuilderService();