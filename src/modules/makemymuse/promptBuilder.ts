import { createHash } from "crypto";
import { MuseCreativeBrief, PromptBuildResult } from "./types";

export const MUSE_PROMPT_VERSION = "makemymuse-adaptive-anchor-demographic-experiment-v3.0.0";

const genderMap = {
  female: "clearly female-presenting fashion-model faces; keep this presentation consistent in all eight candidates",
  male: "clearly male-presenting fashion-model faces; keep this presentation consistent in all eight candidates",
  androgynous: "deliberately androgynous fashion-model faces; keep this presentation consistent in all eight candidates",
} as const;

const skinMap = {
  reference: "use the reference image as broad inspiration for skin appearance",
  warm: "use a warm skin appearance direction",
  cool: "use a cool skin appearance direction",
  neutral: "use a neutral skin appearance direction",
  explore: "explore a creative skin appearance direction while keeping the result photorealistic and harmonious",
} as const;

const candidateDirections = [
  "Variation 1 — INDIAN CONTEMPORARY EDITORIAL: contemporary Indian-market fashion campaign direction; sophisticated editorial grooming and commercial versatility. This is a creative-market direction only; do not stereotype or force ethnicity or facial traits. Apply V2 structural transformation.",
  "Variation 2 — KOREAN CONTEMPORARY EDITORIAL: polished, clean contemporary fashion-campaign styling direction and refined presentation. Do not stereotype or force ethnicity or facial traits. Apply V2 structural transformation.",
  "Variation 3 — AMERICAN COMMERCIAL EDITORIAL: confident international commercial-campaign character and expressive, approachable presentation. Do not stereotype or force ethnicity or facial traits. Apply V2 structural transformation.",
  "Variation 4 — AUSTRALIAN NATURAL EDITORIAL: fresh, relaxed, natural editorial presentation and effortless grooming. Do not stereotype or force ethnicity or facial traits. Apply V2 structural transformation.",
  "Variation 5 — MEDITERRANEAN EDITORIAL: warm, sophisticated editorial mood and expressive campaign presence. Do not stereotype or force ethnicity or facial traits. Apply V2 structural transformation.",
  "Variation 6 — EUROPEAN HIGH-FASHION EDITORIAL: refined luxury-campaign direction, minimalist grooming and premium designer presentation. Do not stereotype or force ethnicity or facial traits. Apply V2 structural transformation.",
  "Variation 7 — EAST ASIAN CONTEMPORARY EDITORIAL: modern, elegant editorial direction and sophisticated presentation. Do not stereotype or force ethnicity or facial traits. Apply V2 structural transformation.",
  "Variation 8 — INTERNATIONAL RUNWAY EDITORIAL: bold, memorable high-fashion/runway creative direction with distinctive campaign character. Do not stereotype or force ethnicity or facial traits. Apply V2 structural transformation.",
];

function cleanDirection(input?: string): string {
  return (input || "").trim().replace(/[\r\n]+/g, " ").slice(0, 300);
}

export function buildEightFacePrompt(brief: MuseCreativeBrief): PromptBuildResult {
  if (!Number.isInteger(brief.apparentAge) || brief.apparentAge < 18 || brief.apparentAge > 60) {
    throw new Error("Apparent age must be an integer between 18 and 60.");
  }
  const transformation = cleanDirection(brief.transformationDirection);
  const prompt = [
    "MAKEMYMUSE — REFERENCE-INSPIRED FICTIONAL FASHION IDENTITY CREATION.",
    "Use the attached, user-authorized reference image as creative inspiration. Create eight distinct fictional adult fashion-model faces, not a photo edit or direct replica.",
    "RESEMBLANCE BALANCE: retain broad, user-directed visual influence from the reference, including overall facial character and selected broad feature relationships. Do not claim or invent biometric measurements. Do not reproduce an exact person's face.",
    "ADAPTIVE IDENTITY ANCHOR EXPERIMENT v2 (BASE RULES RETAINED): reference eyes, nose, and lips are broad creative anchors—not immutable exact copies and not pixel-preserved features. Preserve their general visual character as much as coherent integration allows, while actively redesigning face outline, jaw, cheeks, brow, facial proportions, and balance. Each candidate must change at least THREE facial-structure dimensions beyond styling. Transformation must be visible at first glance, coherent, natural, and non-replicative. Do not claim or invent biometric measurements.",
    "STRICT ANTI-STYLING-ONLY RULE: hairstyle, grooming, makeup, lighting, accessories, and clothing do not count as facial transformation. Change the face design itself.",
    "AGE AND ACCESSORY GUARDRAILS: keep apparent age tightly aligned to the requested age (not older); do not add glasses, jewelry, facial hair, or other accessories unless explicitly requested.",
    "Avoid extreme distortion, artificial symmetry, plastic skin, celebrity likenesses, and stereotyped ethnic/nationality cues.",
    "PRESENTATION: " + genderMap[brief.genderPresentation] + ".",
    "APPARENT AGE: all eight should appear approximately " + brief.apparentAge + " years old. All subjects must clearly be adults and must not appear under 18.",
    "SKIN DIRECTION: " + skinMap[brief.skinDirection] + ".",
    transformation ? "ADDITIONAL CREATIVE DIRECTION: " + transformation + "." : "",
    "EXPERIMENT V3 — DEMOGRAPHIC/EDITORIAL DIRECTION ADDITION: use the eight market/editorial directions below as separate creative briefs to broaden candidate diversity. These directions describe fashion-market mood and editorial presentation, not ethnicity, nationality, race, or stereotyped facial traits. Do not force a candidate to look ethnically or nationally different. Keep the user-selected skin-tone direction, gender presentation, apparent age, and V2 adaptive-anchor rules consistent across all eight. The V2 structural transformation requirement remains mandatory for every cell; styling direction cannot substitute for facial transformation.",
    "CANDIDATE DIVERSITY: generate eight genuinely different fictional faces with variation in facial feature balance, expression, hair/grooming, and editorial character, while maintaining the same selected gender presentation and age direction and a shared broad creative influence from the source. The variation must be in the faces themselves, not just styling.",
    "V3 DEMOGRAPHIC/EDITORIAL DIRECTIONS (one per cell; do not print these labels):",
    ...candidateDirections.map((d, i) => (i + 1) + ". " + d),
    "COMPOSITION: one frontal head-and-shoulders portrait per cell; eyes toward camera; neutral relaxed expression; consistent portrait scale; simple neutral studio background; natural skin texture; no accessories that obscure the face.",
    "GRID: exactly eight portraits in a strict 4-column by 2-row grid. Equal cell sizes. Keep each head, chin, and shoulders inside its own cell. Clear separation; no overlaps, merged faces, extra faces, duplicate candidates, or decorative borders. Do not add text, numbers, captions, logos, or watermarks.",
    "QUALITY CHECK: all eight cells contain one complete face; all eight match the selected presentation and adult age direction; the candidates are distinct; none is a replica of the reference; framing is consistent; the grid is clean and extractable.",
  ].filter(Boolean).join("\n");

  const manifest = {
    promptVersion: MUSE_PROMPT_VERSION,
    creativeBrief: brief,
    layout: "4x2",
    candidateCount: 8,
    promptSha256: createHash("sha256").update(prompt, "utf8").digest("hex"),
  };
  return { promptVersion: MUSE_PROMPT_VERSION, prompt, manifest };
}

export function buildRefinementPrompt(options: MuseCreativeBrief["refinement"]): string {
  const o = options || {};
  const desired = Object.entries(o).map(([key, value]) => key + ": " + String(value)).join("; ");
  return [
    "Refine the attached selected fictional fashion-model face into an actual preview image.",
    "Preserve the selected candidate's face identity and broad feature relationships. Do not replace it with a different person.",
    "Apply only the following requested visual refinements: " + (desired || "no changes specified") + ".",
    "Keep a frontal head-and-shoulders portrait, natural skin texture, consistent neutral studio background, and adult fashion-model appearance.",
    "Do not add text, logos, watermarks, accessories that obscure facial features, or extra faces.",
  ].join("\n");
}
