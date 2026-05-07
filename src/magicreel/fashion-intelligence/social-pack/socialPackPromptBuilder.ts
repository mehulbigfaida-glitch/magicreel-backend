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
Create a high-end fashion campaign photograph using the uploaded model image and logo.

The result must feel like a real luxury brand photoshoot — not a designed poster.

---

CREATIVE INTENT

Produce a cinematic fashion image that feels photographed first and designed second.

The image should resemble a premium luxury campaign shot for a fashion magazine or global brand launch.

---

FORMAT (STRICT REQUIREMENT)

The final output MUST be vertical portrait orientation.

Allowed:
* 4:5 vertical
* 2:3 vertical

Forbidden:
* landscape layouts
* widescreen compositions
* cinematic horizontal framing
* banner-style layouts

The composition must prioritize vertical fashion-photography hierarchy.

The model must occupy strong visual presence within the frame.

Avoid:
* distant subject placement
* excessive empty architecture
* tiny subject scale
* environment dominating over fashion subject

The fashion subject should visually anchor the composition.

---

SUBJECT PRESERVATION (CRITICAL)

Strictly preserve:

* facial identity
* skin tone
* garment design
* embroidery
* textures
* styling details
* silhouette and drape

Do not redesign or alter the outfit.

---

CREATIVE DIRECTION

${creative.cinematicTone}

Interpret this as:

* cinematic editorial photography
* premium luxury atmosphere
* photographic realism
* natural visual depth
* refined fashion storytelling

---

COMPOSITION

* avoid perfect symmetry
* avoid catalog-style posing
* avoid stiff centered framing

Use:

* asymmetrical editorial balance
* intentional negative space
* layered depth
* natural luxury composition
* magazine-style framing

The subject should feel naturally positioned within the frame, not mechanically centered.

---

POSE & CAMERA LANGUAGE

The model should feel like a real luxury fashion campaign subject — not a catalog model.

Use:

* subtle editorial attitude
* natural asymmetry in posture
* relaxed but intentional body positioning
* believable fashion-model confidence
* slight movement energy or cinematic stillness
* elegant hand behavior
* nuanced facial expression

Avoid:

* stiff front-facing posture
* symmetrical standing poses
* mannequin-like presentation
* catalog energy
* influencer-style posing

The pose should feel naturally captured during a premium editorial photoshoot rather than deliberately displayed for ecommerce.

Use a fashion-photography crop:
* strong subject presence
* premium framing
* believable perspective

---

LIGHTING

${creative.lightingStyle}

Enhance using:
${creative.lightingVariants.join(", ")}

Rules:

* lighting must sculpt face and garment
* maintain soft shadow falloff
* background should remain moodier than subject
* preserve dimensionality and realism
* avoid flat lighting

---

BACKGROUND & ENVIRONMENT

${buildBackgroundDirection(input).join("\n") || `
Use a refined luxury environment with cinematic realism and premium depth.
`}

Environment should feel:

* expensive
* atmospheric
* fashion-editorial
* cohesive with the garment mood

Avoid:
* flat gradients
* artificial studio emptiness
* graphic-style backdrops

---

TYPOGRAPHY

If typography is included:

Heading:
"${input.heading || ""}"

Subheading:
"${input.subheading || ""}"

Rules:

* typography must feel naturally integrated
* refined and minimal
* never oversized
* never poster-like
* preserve luxury restraint
* avoid clutter
* do not overlap face or garment details

---

LOGO

Use the uploaded logo image.

Rules:

* preserve original proportions and clarity
* do not redesign or stylize the logo
* integrate subtly into the composition
* logo should feel naturally placed
* maintain realistic luxury-brand behavior
* avoid oversized placement
* avoid floating logo behavior
* logo must remain visually small and refined
* logo should occupy minimal visual attention
* branding should feel restrained and premium
* prioritize editorial realism over logo prominence
---

NEGATIVE

Avoid:

* poster-style layouts
* Canva aesthetics
* influencer edits
* excessive graphic design
* over-stylized AI imagery
* plastic skin
* distorted anatomy
* cluttered composition
* fake luxury branding
* artificial text effects

---

FINAL GOAL

The output must feel indistinguishable from a real luxury fashion campaign image.

It should feel:

* cinematic
* editorial
* expensive
* restrained
* photographic
* premium
* fashion-magazine worthy

The viewer should believe this was art-directed and photographed by a real luxury fashion campaign team.
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
