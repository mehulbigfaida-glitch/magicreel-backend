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

// 🔥 IG PROMO OVERRIDE (UPGRADED — CONTROLLED EXECUTION)
if (input.creativeGoal === "instagram") {
const systemPrompt = `
You are an elite fashion campaign designer specializing in premium Instagram fashion creatives.

Your goal is to produce outputs indistinguishable from real luxury fashion brand posts.

Avoid:

* poster-like layouts
* cluttered composition
* influencer aesthetics
* generic AI visuals

Prioritize:

* strong visual hierarchy
* clean composition
* cinematic realism
* brand-level execution quality
  `.trim();

  const userPrompt = `
  Create a premium Instagram fashion promotional post using the uploaded model image and logo.

---

FORMAT

* Output must be a single 4:5 vertical image (Instagram-ready)
* Do NOT create collage or multi-frame layout

---

STRUCTURE

* one dominant subject (clear focal point)
* strong hierarchy: subject > text > logo
* preserve intentional negative space for typography

---

CREATIVE DIRECTION

${creative.cinematicTone}

Interpret this as a high-fashion editorial execution:

* deep controlled shadows
* subject highlighted using focused lighting
* strong contrast with soft falloff
* cinematic luxury mood

---

COMPOSITION (STRICT)

Choose ONE layout and fully commit:

A. subject left → text right
B. subject right → text left
C. subject centered → text top
D. subject centered → text bottom

Rules:

* do not mix layouts
* maintain breathing space
* composition must feel intentional, not random

---

LIGHTING (STRICT)

${creative.lightingStyle}

Enhance using:
${creative.lightingVariants.join(", ")}

Rules:

* lighting must sculpt subject and garment
* background must remain darker than subject
* avoid flat or evenly lit scenes

---

STYLING

${creative.stylingBehavior.join(", ")}

---

TYPOGRAPHY (CRITICAL)

Render REAL TEXT inside the image.

Heading:
"${input.heading || ""}"

* elegant, modern typography
* medium size (not oversized)
* placed only in negative space
* must NOT overlap face or key garment areas

Subheading:
"${input.subheading || ""}"

* smaller than heading
* aligned cleanly
* visually connected to heading

Rules:

* no random placement
* no poster-style stacking
* no cluttered typography

---

LOGO (STRICT)

Use the uploaded logo image:

* place in a corner based on layout
* small but sharp and readable
* maintain exact proportions
* do not stylize or distort
* must feel like real brand placement

---

NEGATIVE FILTER

Reject outputs that look like:

* Canva posters
* influencer edits
* overdesigned graphics
* generic AI compositions

---

FINAL GOAL

The result must look like a real luxury fashion Instagram post:

* editorial quality
* realistic lighting
* correct typography placement
* premium visual balance
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
