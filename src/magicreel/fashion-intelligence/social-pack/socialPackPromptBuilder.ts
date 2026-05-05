import {
  GeminiPromptPayload,
  SocialPackInput,
} from "./socialPack.types";

import {
  resolveCreativeDirection,
} from "./creativeDirectionResolver";

import {
  resolveCampaignGoal,
} from "./campaignGoalResolver";

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function buildOptionalBranding(
  input: SocialPackInput
): string[] {
  const fragments: string[] = [];

  if (input.brandName) {
    fragments.push(
      `Brand identity: ${input.brandName}`
    );
  }

  if (input.heading) {
    fragments.push(
      `Primary campaign heading: ${input.heading}`
    );
  }

  if (input.subheading) {
    fragments.push(
      `Supporting campaign message: ${input.subheading}`
    );
  }

  return fragments;
}

function buildElementDirection(
  input: SocialPackInput
): string[] {
  if (
    !input.elements ||
    !input.elements.length
  ) {
    return [];
  }

  return [
    `Incorporate premium fashion styling elements including ${input.elements.join(
      ", "
    )} with realistic luxury integration and cinematic styling coherence`,
  ];
}

function buildBackgroundDirection(
  input: SocialPackInput
): string[] {
  if (
    !input.replaceBackground
  ) {
    return [];
  }

  return [
    `Replace the background environment with: ${input.backgroundPrompt}. Ensure cinematic realism, luxury atmosphere, premium spatial depth, and high-end fashion campaign aesthetics`,
  ];
}

export function buildSocialPackPrompt(
  input: SocialPackInput
): GeminiPromptPayload {
  const creative =
    resolveCreativeDirection(
      input.creativeDirection
    );

  const campaign =
    resolveCampaignGoal(
      input.creativeGoal
    );

  const creativeSummary = `
${creative.cinematicTone}
${campaign.outputIntent}
${creative.luxuryMood}
  `.trim();

  const systemPrompt = `
You are an elite luxury fashion creative director and cinematic campaign designer.

Your responsibility is to generate visually sophisticated, non-repetitive, premium fashion campaign creatives for high-end fashion brands.

You must avoid:
- generic AI aesthetics
- cheap influencer styling
- low-end ecommerce composition
- repetitive campaign layouts
- cluttered social media visuals
- plastic AI rendering
- oversaturated glam aesthetics

You must prioritize:
- luxury cinematic realism
- premium campaign hierarchy
- fashion editorial sophistication
- typography-safe composition
- cinematic atmosphere
- premium branding visibility
- couture-level visual direction
- non-repetitive composition behavior
- fashion marketing intelligence
  `.trim();

  const userPrompt = `
Generate a premium fashion campaign creative using the uploaded source image.

CREATIVE DIRECTION:
${creative.cinematicTone}

LUXURY MOOD:
${creative.luxuryMood}

VISUAL ATMOSPHERE:
${creative.visualAtmosphere}

VISUAL CINEMATIC ANCHORS:
${creative.visualAnchors.join(", ")}


COMPOSITION STYLE:
${creative.compositionStyle}

COMPOSITION VARIANTS:
${creative.compositionVariants.join(", ")}

LIGHTING STYLE:
${creative.lightingStyle}

LIGHTING VARIANTS:
${creative.lightingVariants.join(", ")}


CAMPAIGN OBJECTIVE:
${campaign.outputIntent}

COMPOSITION BEHAVIOR:
${campaign.compositionBehavior.join(
  ", "
)}

TYPOGRAPHY BEHAVIOR:
${campaign.typographyBehavior.join(
  ", "
)}

MARKETING BEHAVIOR:
${campaign.marketingBehavior.join(
  ", "
)}

STYLING BEHAVIOR:
${creative.stylingBehavior.join(
  ", "
)}

CINEMATIC KEYWORDS:
${creative.cinematicKeywords.join(
  ", "
)}

BRANDING:
${buildOptionalBranding(
  input
).join("\n")}

ELEMENT DIRECTION:
${buildElementDirection(
  input
).join("\n")}

BACKGROUND DIRECTION:
${buildBackgroundDirection(
  input
).join("\n")}

NEGATIVE CONSTRAINTS:
${unique(
  creative.negativeKeywords
).join(", ")}

Ensure:
- luxury campaign realism
- premium fashion aesthetics
- cinematic visual hierarchy
- professional campaign quality
- editorial-grade composition
- non-repetitive creative behavior
- high-end fashion branding quality
- realistic textile rendering
- premium cinematic atmosphere
  `.trim();

  return {
    systemPrompt,

    userPrompt,

    creativeSummary,
  };
}