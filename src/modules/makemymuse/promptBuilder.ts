import { createHash } from "crypto";
import { MuseCreativeBrief, PromptBuildResult } from "./types";

export const MUSE_PROMPT_VERSION = "makemymuse-facial-architecture-diversity-v6.0.0";

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
  "Candidate 1 — CLASSIC BALANCED: medium-width oval face, balanced forehead-to-midface-to-lower-face proportions, softly defined cheekbones, proportionate jaw and chin. Aim for timeless commercial appeal; do not make this face overly angular.",
  "Candidate 2 — ANGULAR SCULPTED: visibly angular face outline, higher and more prominent cheekbone structure, tapered but defined jaw, slightly narrower lower face. Keep the geometry harmonious and naturally human.",
  "Candidate 3 — SOFT OVAL: rounder cheek volume, gentle cheekbone transitions, softer jaw corners, subtly shorter lower-face impression. Distinct from Candidate 1 through noticeably softer contours.",
  "Candidate 4 — ELONGATED EDITORIAL: longer face silhouette, more vertical facial balance, subtly elongated midface, narrower facial width and clean jaw transition. Avoid simply stretching the face.",
  "Candidate 5 — COMPACT PROPORTIONS: compact facial silhouette, shorter vertical proportions, fuller cheek area, defined but shorter chin and distinct lower-face balance. Do not resemble Candidate 3.",
  "Candidate 6 — STRONG CHEEKBONE / TAPERED JAW: pronounced cheekbone placement, clear cheek-to-jaw transition, tapered lower face and distinctive chin geometry. Different from Candidate 2 in jaw taper and midface balance.",
  "Candidate 7 — DISTINCTIVE EDITORIAL: unconventional yet attractive facial balance; choose a distinctive combination of eye spacing/shape, brow design, cheek placement and jaw contour. Avoid the common generic fashion-model face template.",
  "Candidate 8 — RUNWAY CHARACTER: striking silhouette with a distinctive face outline, strong but natural feature relationships, memorable cheek/jaw balance and premium runway character. Must be structurally different from Candidates 2, 6 and 7.",
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
    "V6 PRIORITY HIERARCHY — follow in this order: (1) REQUESTED ADULT AGE, (2) EIGHT DISTINCT FACIAL ARCHITECTURES, (3) NATURAL SKIN REALISM, (4) COMMERCIAL FASHION APPEAL, (5) COHERENT STRUCTURAL TRANSFORMATION, (6) BROAD REFERENCE INSPIRATION, (7) EDITORIAL MOOD, (8) HAIR/GROOMING/STYLING. Lower priorities must not compromise higher priorities.",
    "YOUTH RECONSTRUCTION: when the target age is below 35, create a genuinely youthful adult face of that target age—not a younger-looking edit of the reference and not a mature adult with wrinkles removed. Reconstruct youthful facial proportions, midface balance, cheek volume, eye-area character, lower-face contours, jaw, and overall youthful facial vitality. Avoid mature facial heaviness or features that read as middle-aged. For a target around 25, candidates should convincingly read as approximately 25 while remaining clearly adult. Do not make anyone appear under 18.",
    "V6 FACIAL ARCHITECTURE DIVERSITY: the eight cells are eight independent face-design briefs. Do not start from one generic attractive face and vary hair, beard, makeup, expression, clothing, lighting or accessories. Build each face from its assigned architecture. Make at least FOUR clearly visible structural differences among the eight candidates across face outline, face length/width, cheekbone placement/volume, jaw angle/taper, chin shape, brow structure, midface proportions, and feature spacing. The assigned profile must be evident even if all eight portraits had identical hair, clothing, lighting and expression. Avoid repeating the same narrow jaw, high cheekbones, almond eyes, small nose and full lips combination across most candidates. Diversity means different harmonious facial structures, not simply different styling.",
    "NATURAL SKIN REALISM: maintain realistic fine skin microtexture and naturally visible pores across cheeks, nose, forehead, and chin. Preserve subtle natural tonal variation. Do not airbrush, blur, over-smooth, or create waxy, plastic, porcelain, doll-like, or beauty-filter skin. Youthful skin must still look like real human skin; pores should be natural and subtle, not exaggerated. Avoid artificial sharpening.",
    "ADAPTIVE IDENTITY ANCHORS: reference eyes, nose, and lips are broad creative inspiration—not immutable copies or pixel-preserved features. Retain broad visual character only where compatible with the age-first and structural transformation goals. Do not let resemblance override youthful age or the assigned archetype. Do not claim or invent biometric measurements.",
    "STRICT ANTI-STYLING-ONLY RULE: styling changes do not count as transformation. Change the face design itself. Avoid extreme distortion, artificial symmetry, celebrity likenesses, and stereotyped ethnicity/nationality cues.",
    "AGE-CONDITIONED HAIR RULE: when the target apparent age is below 35, do not include grey, silver, salt-and-pepper, or visibly age-associated hair or facial hair unless explicitly requested. Keep hair and facial-hair color youthful and consistent with the selected creative direction. For every target age, avoid using grey hair as a candidate-diversity shortcut. All candidates must convincingly match the requested age; for target 25, none should read as 35–50 or older.",
    "PRESENTATION: " + genderMap[brief.genderPresentation] + ".",
    "APPARENT AGE: all eight should appear approximately " + brief.apparentAge + " years old. All subjects must clearly be adults and must not appear under 18.",
    "SKIN DIRECTION: " + skinMap[brief.skinDirection] + ".",
    transformation ? "ADDITIONAL CREATIVE DIRECTION: " + transformation + "." : "",
    "COMMERCIAL FACE-QUALITY GUIDANCE: aim for attractive, harmonious, commercially viable fashion-model facial architecture—balanced proportions, appealing face cuts, clear but natural jaw and cheek structure, expressive eyes, and distinctive character. The user observed especially appealing face-cut qualities in prior candidates 2, 6, 7, and 8; use that as a quality benchmark only, not as a template or duplication instruction. Create eight different face cuts, not eight copies of those examples. Archetypes remain the primary facial design instructions; editorial directions are secondary mood/styling briefs. Do not force ethnicity, nationality, race, or stereotyped traits. Maintain selected skin direction and gender presentation consistently. Youth reconstruction and natural skin requirements apply to every cell.",
    "CANDIDATE SEPARATION: adjacent candidates and especially candidates 2, 6, 7 and 8 must not collapse into similar angular/tapered faces. Candidate 2 is angular and defined; Candidate 6 is cheekbone-led with a tapered jaw; Candidate 7 is distinctive and unconventional in facial balance; Candidate 8 is runway-character with a memorable overall silhouette. Ensure these four are visibly different from each other.\nEIGHT-WAY FACE DIVERSITY: the eight faces must be visually distinguishable by facial architecture at thumbnail size. If any two look like siblings or like the same model with different styling, redesign one of their structural profiles before finalizing. Use varied but plausible feature relationships; no extreme distortions.",
    "V6 ARCHITECTURE PROFILES (one per cell; do not print labels):",
    ...candidateDirections.map((d, i) => (i + 1) + ". " + d),
    "COMPOSITION: one frontal head-and-shoulders portrait per cell; eyes toward camera; neutral relaxed expression; consistent portrait scale; simple neutral studio background; realistic natural skin pores and microtexture; natural youthful hair color when target age is below 35; no accessories that obscure the face.",
    "GRID: exactly eight portraits in a strict 4-column by 2-row grid. Equal cell sizes. Keep each head, chin, and shoulders inside its own cell. Clear separation; no overlaps, merged faces, extra faces, duplicate candidates, or decorative borders. Do not add text, numbers, captions, logos, or watermarks.",
    "QUALITY CHECK: all eight cells contain one complete face; all eight match the selected presentation and adult age direction; the candidates are structurally distinct at thumbnail size; none is a replica of the reference; framing is consistent; the grid is clean and extractable.",
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
