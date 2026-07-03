/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Campaign Director User Prompt Builder
 * ============================================================================
 */

import { CampaignInput } from "../types/campaign.types";

export function buildCampaignDirectorUserPrompt(
  input: CampaignInput
): string {
  return `
Create the creative vision for the following advertising campaign.

CAMPAIGN ASSETS

Hero Image
${input.heroImageUrl}

Brand Logo
${input.logoUrl}

Headline
${input.headline}

Subheadline
${input.subheadline ?? "Not provided"}

CTA
${input.cta ?? "Not provided"}

Your task is to determine:

1. Creative Direction
2. Composition
3. Visual Mood
4. Typography Style
5. Visual Hierarchy
6. Logo Placement

Return ONLY valid JSON matching the required schema.
`.trim();
}