
/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Image Generation User Prompt Builder
 * ============================================================================
 */

import { PromptBuildInput } from "../types/campaign.types";

export function buildImageGenerationUserPrompt(
  input: PromptBuildInput
): string {
  const supportingAssets =
    input.supportingHeroUrls.length > 0
      ? input.supportingHeroUrls
          .map(
            (url, index) =>
              `${index + 1}. ${url}`
          )
          .join("\n")
      : "No supporting assets provided.";

  return `
Create a premium advertising campaign using the following assets.

====================================================
MASTER HERO IMAGE
====================================================

${input.heroImageUrl}

====================================================
SUPPORTING HERO ASSETS
====================================================

${supportingAssets}

====================================================
BRAND LOGO
====================================================

${input.logoUrl}

====================================================
CAMPAIGN COPY
====================================================

Headline:
${input.headline}

Subheadline:
${input.subheadline ?? "Not provided"}

CTA:
${input.cta ?? "Not provided"}

====================================================
CREATIVE VISION
====================================================

Creative Direction:
${input.vision.creativeDirection}

Composition:
${input.vision.composition}

Visual Mood:
${input.vision.visualMood}

Hierarchy:
${input.vision.hierarchy}

Typography:
${input.vision.typographyStyle}

Logo Placement:
${input.vision.logoPlacement}

====================================================
IMPORTANT
====================================================

The Master Hero Image is the primary subject.

Supporting Hero Assets are reference images that may
be used only when they improve the campaign layout,
storytelling, or product presentation.

Never alter or redesign the product shown in the
Master Hero Image.

Preserve the logo exactly.

Maintain complete product fidelity.

Create a premium commercial campaign with outstanding
visual hierarchy, typography, spacing, branding and
readability.

The final artwork must look like it was designed by a
world-class advertising agency for a luxury fashion
brand.
`.trim();
}
