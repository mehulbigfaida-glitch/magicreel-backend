import { createHash } from "crypto";
import { MuseCreativeBrief, PromptBuildResult } from "./types";

export const MUSE_PROMPT_VERSION = "makemymuse-youth-reconstruction-commercial-face-v5.0.0";

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
  "Candidate 1 — ADAPTIVE ANCHOR: moderate structural redesign while retaining broad eye/nose/lip character; distinctly youthful face outline and balanced youthful proportions. Editorial direction: Indian contemporary.",
  "Candidate 2 — ANGULAR STRUCTURE: clearly redesigned jaw angle, cheekbone placement, brow and face width; youthful, defined but natural structure. Editorial direction: Korean contemporary.",
  "Candidate 3 — SOFT OVAL: softer cheek volume, oval face shape and smoother jaw transitions; unmistakably youthful adult proportions. Editorial direction: American commercial.",
  "Candidate 4 — ELONGATED: longer facial silhouette, altered midface and vertical balance, redesigned jaw and cheeks; youthful rather than mature. Editorial direction: Australian natural.",
  "Candidate 5 — COMPACT: shorter compact face, altered cheek volume, midface proportions and jaw; youthful adult appearance. Editorial direction: Mediterranean.",
  "Candidate 6 — FEATURE REBALANCED: redesign nose bridge/tip, lip proportions, brow, cheeks and feature relationships into a cohesive fictional face; youthful. Editorial direction: European high-fashion.",
  "Candidate 7 — STRONG TRANSFORMATION: substantially redesign face outline, jaw, cheeks, brow and overall proportions; retain only broad reference inspiration; youthful. Editorial direction: East Asian contemporary, without ethnicity stereotyping.",
  "Candidate 8 — LUXURY EDITORIAL: distinctive high-fashion facial architecture, memorable face silhouette and cheek/jaw proportions, natural youthful adult appearance. Editorial direction: international runway.",
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
    "V5 PRIORITY HIERARCHY — follow in this order: (1) YOUTH RECONSTRUCTION, (2) FACIAL STRUCTURAL TRANSFORMATION, (3) NATURAL SKIN REALISM, (4) COMMERCIAL FASHION APPEAL, (5) DISTINCT CANDIDATE FACES, (6) BROAD REFERENCE ANCHORS, (7) EDITORIAL DIRECTION, (8) HAIR/GROOMING/STYLING. Lower priorities must not compromise higher priorities.",
    "V5 YOUTH RECONSTRUCTION: when the target age is below 35, create a genuinely youthful adult face of that target age—not a younger-looking edit of the reference and not a mature adult with wrinkles removed. Reconstruct youthful facial proportions, midface balance, cheek volume, eye-area character, lower-face contours, jaw, and overall youthful facial vitality. Avoid mature facial heaviness or features that read as middle-aged. For a target around 25, candidates should convincingly read as approximately 25 while remaining clearly adult. Do not make anyone appear under 18.",
    "STRUCTURAL ARCHETYPE EXPERIMENT V4: assign one different facial-structure archetype to each of the eight cells below. The archetype is the primary design instruction for the face itself. Each candidate must visibly differ in at least THREE structural dimensions such as face outline, jaw shape, cheekbone placement/volume, brow structure, midface proportions, facial width/length balance, or feature relationships. Hair, beard, makeup, clothing, lighting, and accessories do not count as structural differences.",
    "NATURAL SKIN REALISM: maintain realistic fine skin microtexture and naturally visible pores across cheeks, nose, forehead, and chin. Preserve subtle natural tonal variation. Do not airbrush, blur, over-smooth, or create waxy, plastic, porcelain, doll-like, or beauty-filter skin. Youthful skin must still look like real human skin; pores should be natural and subtle, not exaggerated. Avoid artificial sharpening.",
    "ADAPTIVE IDENTITY ANCHORS: reference eyes, nose, and lips are broad creative inspiration—not immutable copies or pixel-preserved features. Retain broad visual character only where compatible with the age-first and structural transformation goals. Do not let resemblance override youthful age or the assigned archetype. Do not claim or invent biometric measurements.",
    "STRICT ANTI-STYLING-ONLY RULE: styling changes do not count as transformation. Change the face design itself. Avoid extreme distortion, artificial symmetry, celebrity likenesses, and stereotyped ethnicity/nationality cues.",
    "V5 AGE-CONDITIONED HAIR RULE: when the target apparent age is below 35, do not include grey, silver, salt-and-pepper, or visibly age-associated hair or facial hair unless explicitly requested. Keep hair and facial-hair color youthful and consistent with the selected creative direction. For every target age, avoid using grey hair as a candidate-diversity shortcut. All candidates must convincingly match the requested age; for target 25, none should read as 35–50 or older.",
    "PRESENTATION: " + genderMap[brief.genderPresentation] + ".",
    "APPARENT AGE: all eight should appear approximately " + brief.apparentAge + " years old. All subjects must clearly be adults and must not appear under 18.",
    "SKIN DIRECTION: " + skinMap[brief.skinDirection] + ".",
    transformation ? "ADDITIONAL CREATIVE DIRECTION: " + transformation + "." : "",
    "V5 COMMERCIAL FACE-QUALITY GUIDANCE: aim for attractive, harmonious, commercially viable fashion-model facial architecture—balanced proportions, appealing face cuts, clear but natural jaw and cheek structure, expressive eyes, and distinctive character. The user observed especially appealing face-cut qualities in prior candidates 2, 6, 7, and 8; use that as a quality benchmark only, not as a template or duplication instruction. Create eight different face cuts, not eight copies of those examples. Archetypes remain the primary facial design instructions; editorial directions are secondary mood/styling briefs. Do not force ethnicity, nationality, race, or stereotyped traits. Maintain selected skin direction and gender presentation consistently. Youth reconstruction and natural skin requirements apply to every cell.",
    "CANDIDATE DIVERSITY: generate eight genuinely different fictional faces with variation in facial feature balance, expression, hair/grooming, and editorial character, while maintaining the same selected gender presentation and age direction and a shared broad creative influence from the source. The variation must be in the faces themselves, not just styling.",
    "V4 FACIAL ARCHETYPES WITH PAIRED EDITORIAL DIRECTIONS (one per cell; do not print labels):",
    ...candidateDirections.map((d, i) => (i + 1) + ". " + d),
    "COMPOSITION: one frontal head-and-shoulders portrait per cell; eyes toward camera; neutral relaxed expression; consistent portrait scale; simple neutral studio background; realistic natural skin pores and microtexture; natural youthful hair color when target age is below 35; no accessories that obscure the face.",
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
