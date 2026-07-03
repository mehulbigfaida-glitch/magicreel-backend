/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Validator
 * ============================================================================
 */

import { CampaignInput } from "../types/campaign.types";

export class CampaignValidationError extends Error {
  public readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "CampaignValidationError";
  }
}

export function validateCampaignInput(
  input: unknown
): asserts input is CampaignInput {
  if (!input || typeof input !== "object") {
    throw new CampaignValidationError("Request body is required.");
  }

  const campaign = input as Partial<CampaignInput>;

  validateRequiredString(campaign.heroImageUrl, "heroImageUrl");

  validateRequiredString(campaign.logoUrl, "logoUrl");

  validateRequiredString(campaign.headline, "headline");

  validateOptionalString(campaign.subheadline, "subheadline");

  validateOptionalString(campaign.cta, "cta");

  validateSupportingAssets(
    campaign.supportingHeroUrls
  );
}

function validateRequiredString(
  value: unknown,
  fieldName: string
): void {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new CampaignValidationError(
      `${fieldName} is required.`
    );
  }
}

function validateOptionalString(
  value: unknown,
  fieldName: string
): void {
  if (
    value !== undefined &&
    (typeof value !== "string" ||
      value.trim().length === 0)
  ) {
    throw new CampaignValidationError(
      `${fieldName} must be a non-empty string if provided.`
    );
  }
}

function validateSupportingAssets(
  value: unknown
): void {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value)) {
    throw new CampaignValidationError(
      "supportingHeroUrls must be an array."
    );
  }

  if (value.length > 4) {
    throw new CampaignValidationError(
      "Maximum 4 supporting assets are allowed."
    );
  }

  for (const url of value) {
    if (
      typeof url !== "string" ||
      url.trim().length === 0
    ) {
      throw new CampaignValidationError(
        "Every supportingHeroUrls item must be a non-empty string."
      );
    }
  }
}