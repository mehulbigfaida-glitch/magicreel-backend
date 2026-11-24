import { createHash } from "crypto";
import { MuseCreativeBrief, PromptBuildResult } from "./types";

export const MUSE_PROMPT_VERSION = "makemymuse-identity-transformation-v1.0.0";

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
  "Variation A: restrained transformation; emphasize harmonious resemblance anchors and subtle feature evolution.",
  "Variation B: slightly more defined eye and eyebrow character; preserve broad reference influence.",
  "Variation C: explore a different cheek and jawline balance while retaining recognizable broad inspiration.",
  "Variation D: explore nose and lip detailing in a coherent fashion-model design.",
  "Variation E: explore a softer facial-feature balance and expression.",
  "Variation F: explore a sharper editorial feature balance, without exaggeration.",
  "Variation G: explore a different hairstyle and grooming direction while keeping the face design distinctive.",
  "Variation H: explore a memorable luxury-fashion editorial character with controlled transformation.",
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
    "CREATIVE TRANSFORMATION: make meaningful, coherent changes so each output is a distinct fictional face. Do not merely change hairstyle, makeup, lighting, or clothing. Avoid extreme distortion, artificial symmetry, plastic skin, celebrity likenesses, and stereotyped ethnic/nationality cues.",
    "PRESENTATION: " + genderMap[brief.genderPresentation] + ".",
    "APPARENT AGE: all eight should appear approximately " + brief.apparentAge + " years old. All subjects must clearly be adults and must not appear under 18.",
    "SKIN DIRECTION: " + skinMap[brief.skinDirection] + ".",
    transformation ? "ADDITIONAL CREATIVE DIRECTION: " + transformation + "." : "",
    "CANDIDATE DIVERSITY: generate eight genuinely different fictional faces with variation in facial feature balance, expression, hair/grooming, and editorial character, while maintaining the same selected gender presentation and age direction and a shared broad creative influence from the source. The variation must be in the faces themselves, not just styling.",
    "CELL DIRECTIONS (one per cell; do not print these labels):",
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
