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

* one dominant fashion subject with editorial presence
* subject must NOT feel like ecommerce catalog photography
* composition must feel directed by a luxury fashion creative director
* preserve cinematic negative space for typography
* maintain intentional asymmetry and visual balance
* create depth using foreground/background separation
* framing must resemble luxury fashion campaign photography
* avoid static centered balance unless artistically justified
* composition should feel premium, restrained, and expensive

Use cinematic editorial framing techniques:

* off-center subject placement
* layered spatial depth
* controlled empty space
* luxury visual breathing room
* magazine-style composition hierarchy

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

Choose ONE luxury editorial composition approach:

A. cinematic left-weighted composition
B. cinematic right-weighted composition
C. architectural centered composition
D. negative-space dominant editorial framing

Rules:

* composition must feel intentional and art-directed
* avoid ecommerce symmetry
* preserve typography-safe regions
* allow cinematic breathing room
* create visual depth between subject and environment
* subject should not always occupy full frame height
* framing should resemble premium fashion magazine campaigns

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

LOGO RULES

* use the uploaded logo asset exactly as provided
* do NOT redesign the logo
* do NOT generate substitute luxury brand marks
* do NOT hallucinate typography-based logos
* preserve logo fidelity and recognizability
* place logo subtly and professionally
* logo should feel naturally integrated into the campaign
* maintain luxury-brand presentation quality
* avoid oversized logo placement
* logo must not dominate the composition


FINAL GOAL

The final output must resemble a real luxury fashion campaign produced by a world-class creative agency.

The image should feel:

* cinematic
* editorial
* expensive
* visually restrained
* fashion-forward
* magazine-worthy
* luxury-brand authentic

The result must NOT resemble:

* ecommerce photography
* influencer edits
* AI-generated posters
* Canva-style social graphics
* generic fashion ads

The viewer should immediately believe this belongs to a premium luxury fashion brand campaign.
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
