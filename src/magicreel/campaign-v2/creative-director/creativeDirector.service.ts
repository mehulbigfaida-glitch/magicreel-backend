/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Creative Director Service
 * ============================================================================
 *
 * Responsibility:
 * ---------------------------------------------------------------------------
 * Convert the Campaign Director vision into production-ready creative
 * directions for Prompt Builder.
 *
 * This service MUST NOT:
 * - Generate images
 * - Call FAL
 * - Upload assets
 * - Perform visual analysis
 * ============================================================================
 */

import {
  CampaignInput,
  CreativeVision,
} from "../types/campaign.types";

export interface CreativeDirection {
  headlineTreatment: string;
  typographyDirection: string;
  colorDirection: string;
  backgroundDirection: string;
  lightingDirection: string;
  compositionDirection: string;
  productPriority: string;
  brandingDirection: string;
  emotionalTone: string;
  renderingStyle: string;
}

export class CreativeDirectorService {
  public async createCreativeDirection(
    input: CampaignInput,
    vision: CreativeVision
  ): Promise<CreativeDirection> {
    const direction: CreativeDirection = {
      headlineTreatment: this.buildHeadlineTreatment(input, vision),

      typographyDirection: vision.typographyStyle,

      colorDirection: this.buildColorDirection(vision),

      backgroundDirection: this.buildBackgroundDirection(vision),

      lightingDirection: this.buildLightingDirection(vision),

      compositionDirection: vision.composition,

      productPriority: "Product must remain the dominant visual subject.",

      brandingDirection: this.buildBrandingDirection(vision),

      emotionalTone: vision.visualMood,

      renderingStyle:
        "Premium commercial advertising. Ultra realistic. Luxury campaign quality.",
    };

    this.validate(direction);

    return direction;
  }

  private buildHeadlineTreatment(
    input: CampaignInput,
    vision: CreativeVision
  ): string {
    return `${vision.hierarchy}. Headline: "${input.headline}"`;
  }

  private buildColorDirection(
    vision: CreativeVision
  ): string {
    return `Use a color palette that reinforces ${vision.visualMood}.`;
  }

  private buildBackgroundDirection(
    vision: CreativeVision
  ): string {
    return `Background should support ${vision.creativeDirection} without distracting from the product.`;
  }

  private buildLightingDirection(
    vision: CreativeVision
  ): string {
    return `Premium commercial lighting consistent with ${vision.visualMood}.`;
  }

  private buildBrandingDirection(
    vision: CreativeVision
  ): string {
    return `Logo placement: ${vision.logoPlacement}. Branding must appear premium and unobtrusive.`;
  }

  private validate(
    direction: CreativeDirection
  ): void {
    for (const value of Object.values(direction)) {
      if (
        typeof value !== "string" ||
        value.trim().length === 0
      ) {
        throw new Error(
          "Creative Director produced an invalid CreativeDirection."
        );
      }
    }
  }
}

export default new CreativeDirectorService();