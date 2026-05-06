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
if (!input.elements || !input.elements.length) {
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
if (!input.replaceBackground) {
return [];
}

return [
`Replace the background environment with: ${input.backgroundPrompt}. Ensure cinematic realism, luxury atmosphere, premium spatial depth, and high-end fashion campaign aesthetics`,
];
}

export function buildSocialPackPrompt(
input: SocialPackInput
): GeminiPromptPayload {
const creative = resolveCreativeDirection(
input.creativeDirection,
input.brandName,
input.heading,
input.subheading
);

const campaign = resolveCampaignGoal(
input.creativeGoal
);

// ✅ FIX: declare BEFORE IG block
const creativeSummary = `${creative.cinematicTone}
${campaign.outputIntent}
${creative.luxuryMood}
 `.trim();

// 🔥 IG PROMO OVERRIDE (MAIN UPGRADE)
if (input.creativeGoal === "instagram") {
const systemPrompt = `
You are an elite fashion campaign designer specializing in Instagram luxury posts.

Your goal is to create highly realistic, premium, non-AI-looking Instagram fashion creatives.

Avoid:

* poster-like layouts
* clutter
* influencer aesthetics
* generic AI compositions

Prioritize:

* clean composition
* strong visual hierarchy
* realistic brand-level output
  `.trim();

  const userPrompt = `
  Create a premium Instagram fashion promotional post using the uploaded model image.

---

STRUCTURE

* single strong subject
* vertical 4:5 Instagram composition
* strong focal hierarchy
* clear negative space for text

---

CREATIVE DIRECTION

${creative.cinematicTone}

Lighting & mood must strictly follow this direction.

---

COMPOSITION VARIATION

Randomly choose ONE layout:

1. subject slightly left, text right
2. subject slightly right, text left
3. subject centered, text top
4. subject centered, text bottom

---

LIGHTING

${creative.lightingStyle}

Enhance with:
${creative.lightingVariants.join(", ")}

---

STYLING

${creative.stylingBehavior.join(", ")}

---

TYPOGRAPHY

Heading:
"${input.heading || ""}"

* elegant and clean
* medium size
* placed in negative space
* do not overlap face or garment

Subheading:
"${input.subheading || ""}"

* smaller than heading
* aligned cleanly

---

LOGO

Use uploaded logo:

* small size
* corner placement
* maintain proportions
* do not distort
* subtle premium branding

---

NEGATIVE

* no cheap poster
* no clutter
* no random placement
* no over-editing
* no AI-looking composition

---

OUTPUT

* must look like real brand Instagram post
* cinematic realism
* clean premium layout
  `.trim();

  return {
  systemPrompt,
  userPrompt,
  creativeSummary,
  };
  }

  // 🔁 DEFAULT FLOW (UNCHANGED)

  const systemPrompt = `
  You are an elite luxury fashion creative director and cinematic campaign designer.

Your responsibility is to generate visually sophisticated, non-repetitive, premium fashion campaign creatives for high-end fashion brands.

You must avoid:

* generic AI aesthetics
* cheap influencer styling
* low-end ecommerce composition
* repetitive campaign layouts
* cluttered social media visuals
* plastic AI rendering
* oversaturated glam aesthetics

You must prioritize:

* luxury cinematic realism
* premium campaign hierarchy
* fashion editorial sophistication
* typography-safe composition
* cinematic atmosphere
* premium branding visibility
* couture-level visual direction
* non-repetitive composition behavior
* fashion marketing intelligence
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
${campaign.compositionBehavior.join(", ")}

TYPOGRAPHY BEHAVIOR:
${campaign.typographyBehavior.join(", ")}

MARKETING BEHAVIOR:
${campaign.marketingBehavior.join(", ")}

STYLING BEHAVIOR:
${creative.stylingBehavior.join(", ")}

CINEMATIC KEYWORDS:
${creative.cinematicKeywords.join(", ")}

BRANDING:
${buildOptionalBranding(input).join("\n")}

ELEMENT DIRECTION:
${buildElementDirection(input).join("\n")}

BACKGROUND DIRECTION:
${buildBackgroundDirection(input).join("\n")}

NEGATIVE CONSTRAINTS:
${unique(creative.negativeKeywords).join(", ")}

Ensure:

* luxury campaign realism
* premium fashion aesthetics
* cinematic visual hierarchy
* professional campaign quality
* editorial-grade composition
* non-repetitive creative behavior
* high-end fashion branding quality
* realistic textile rendering
* premium cinematic atmosphere
  `.trim();

  return {
  systemPrompt,
  userPrompt,
  creativeSummary,
  };
  }
