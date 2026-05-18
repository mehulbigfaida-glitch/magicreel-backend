import { resolveGarment } from "../intelligence/resolveGarment";
import { buildPromptRules } from "../intelligence/promptRules";

export function buildCreateAIPrompt(
  category?: string,
  garmentName?: string
) {

  // =====================================
  // GARMENT INTELLIGENCE
  // =====================================

  const garmentDNA =
    resolveGarment(
      category ?? "",
      garmentName ?? ""
    );

  const intelligenceRules =
    buildPromptRules(
      garmentDNA
    );

  return `
Use the garment image as the PRIMARY source of truth.

The garment must remain visually identical.

Preserve exactly:
- garment silhouette
- garment construction
- garment proportions
- embroidery
- textile texture
- stitching
- garment color
- sleeve details
- neckline
- hem structure
- fit behavior
- draping behavior
- folds
- garment length

Do not redesign, reinterpret, simplify, enhance, restyle, or modify the garment.

Use the Muse image only as identity and human reference.

Preserve exactly:
- face identity
- hairstyle
- natural human consistency
- realistic appearance
- natural proportions

Do not:
- crop body
- generate half body
- create sitting pose
- hide feet
- create side view
- generate multiple people
- create mirrored subjects
- alter identity

Generate:

premium fashion Hero image

Composition:
- portrait 4:5
- full body
- entire person visible from head to feet
- centered composition
- symmetrical framing
- premium fashion presentation

Background:

clean premium luxury fashion studio

soft seamless studio environment

background color:
#E8E8E6

subtle premium shadows

minimal environment

Do not generate:
- furniture
- props
- city scenes
- outdoor locations
- runway environments
- distractions

Keep visual attention on:
garment and subject only

Photography:
- ultra realistic
- high-end commercial fashion campaign
- premium editorial photography
- luxury studio lighting
- sharp textile details
- premium DSLR quality

Garment Intelligence Rules:

${intelligenceRules}

`;
}