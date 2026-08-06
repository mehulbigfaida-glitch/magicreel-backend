import { getEditorialWorld } from "../registry/worlds";
import { OutputProfile } from "../registry/outputProfiles";
import { EditorialWorld } from "../types/editorial.types";

export interface EditorialPromptInput {
  worldId: string;
  output: OutputProfile;
  heroCount: number;
}

export class EditorialPromptBuilder {

  build(
    input: EditorialPromptInput
  ): string {

    const world = getEditorialWorld(
      input.worldId
    );

    return [

  this.introductionSection(input.heroCount),

  this.primaryFashionModelSection(),

  this.additionalFashionModelsSection(),

  this.chemistrySection(
      input.heroCount,
      world
  ),

  this.editorialWorldSection(world),

  this.editorialDirectionSection(world),

  this.outputSection(input.output),

  this.importantSection(),

  this.avoidSection(
      world,
      input.heroCount
  ),

].join("\n\n");

  }

  // ===========================================================================
  // INTRODUCTION
  // ===========================================================================

  private introductionSection(
    heroCount: number
): string {

    return `

Create an entirely new luxury fashion editorial campaign inspired by the supplied Fashion Models and the selected Editorial World.

The final editorial composition MUST visibly contain all ${heroCount} supplied Fashion Models.

Every supplied Fashion Model must appear exactly once.

No supplied Fashion Model may be omitted.

No additional Fashion Models may be created.

Produce a premium magazine-quality photograph with authentic storytelling, refined composition and exceptional garment presentation while preserving the identity of every supplied Fashion Model.

`.trim();

  }


  // ===========================================================================
  // PRIMARY FASHION MODEL
  // ===========================================================================

  private primaryFashionModelSection(): string {

    return `

====================================================
PRIMARY FASHION MODEL
====================================================

The first reference image is the Primary Fashion Model.

Preserve the Fashion Model's identity, facial features, body proportions, hairstyle, garments, styling and overall visual authenticity.

Use this Fashion Model as the principal subject of the editorial composition.

Never recreate the supplied reference photograph. Create an entirely new editorial scene.

`.trim();

  }

  // ===========================================================================
  // ADDITIONAL FASHION MODELS
  // ===========================================================================

  private additionalFashionModelsSection(): string {

  return `

====================================================
ADDITIONAL FASHION MODELS
====================================================

Any remaining reference images represent Additional Fashion Models.

Include every supplied Fashion Model naturally within the same editorial environment while preserving each individual's identity, garments and styling.

Do not introduce additional Fashion Models that were not supplied.

`.trim();

}

private chemistrySection(
  heroCount: number,
  world: EditorialWorld
): string {

  if (heroCount < 2) {
    return "";
  }

  return `

====================================================
CHEMISTRY
====================================================

Treat every supplied Fashion Model as a real individual naturally sharing the same moment inside the selected Editorial World.

Their relationship should emerge organically from the world's mood, atmosphere and editorial direction rather than appearing staged or artificially posed.

World Mood

${world.dna.mood
  .slice(0, 3)
  .map(x => `- ${x}`)
  .join("\n")}

World Behaviours

${world.behaviours
  .slice(0, 3)
  .map(x => `- ${x}`)
  .join("\n")}

Editorial Interaction

${world.interactions
  .slice(0, 3)
  .map(x => `- ${x}`)
  .join("\n")}

Preserve every supplied Fashion Model exactly as provided.

Maintain identity, facial structure, hairstyle, garments, body proportions and styling.

Never merge identities.

Never duplicate Fashion Models.

Every supplied Fashion Model is an equally important participant in the editorial narrative.

The composition is considered incomplete unless every supplied Fashion Model is clearly visible exactly once.

Allocate balanced visual importance to every supplied Fashion Model so that no individual becomes visually insignificant or omitted.

Ensure every Fashion Model contributes naturally to the editorial narrative while the garments remain the primary visual subject.

`.trim();

}

    // ===========================================================================
  // EDITORIAL WORLD
  // ===========================================================================

  private editorialWorldSection(
    world: EditorialWorld
  ): string {

    return `

====================================================
EDITORIAL WORLD
====================================================

World

${world.name}

Description

${world.description}

Create the campaign entirely within this Editorial World.

Its visual identity is defined by ${world.dna.architecture.slice(0, 4).join(", ")}, complemented by ${world.dna.environment.slice(0, 4).join(", ")}, illuminated through ${world.dna.lighting.slice(0, 3).join(", ")}, enriched with ${world.dna.colors.slice(0, 3).join(", ")}, shaped by ${world.dna.weather.slice(0, 2).join(", ")}, and elevated by ${world.dna.atmosphere.slice(0, 3).join(", ")}.

Every photograph should naturally embody the mood of ${world.dna.mood.slice(0, 4).join(", ")} while maintaining complete visual consistency throughout the campaign.

`.trim();

  }

  // ===========================================================================
  // EDITORIAL DIRECTION
  // ===========================================================================

  private editorialDirectionSection(
    world: EditorialWorld
  ): string {

    return `

====================================================
EDITORIAL DIRECTION
====================================================

Photograph the Fashion Models naturally as they inhabit this Editorial World.

Encourage authentic movement, believable human interaction, premium editorial storytelling, refined composition and luxurious medium-format fashion photography.

Natural Behaviour

${world.behaviours
  .slice(0, 4)
  .map(x => `- ${x}`)
  .join("\n")}

Photography Intent

${world.photographerIntent
  .slice(0, 4)
  .map(x => `- ${x}`)
  .join("\n")}

Creative Focus

${[
  ...world.interactions.slice(0, 2),
  ...world.cameraLanguage.slice(0, 2),
  ...world.editorialRules.slice(0, 2),
]
  .map(x => `- ${x}`)
  .join("\n")}

`.trim();

  }

  // ===========================================================================
  // OUTPUT
  // ===========================================================================

  private outputSection(
    output: OutputProfile
  ): string {

    return `

====================================================
OUTPUT
====================================================

Orientation

${output.orientation}

Composition

${output.composition
  .map(x => `- ${x}`)
  .join("\n")}

Framing

${output.framing
  .map(x => `- ${x}`)
  .join("\n")}

Hierarchy

${output.hierarchy
  .map(x => `- ${x}`)
  .join("\n")}

`.trim();

  }

    // ===========================================================================
  // IMPORTANT
  // ===========================================================================

  private importantSection(): string {

    return `

====================================================
IMPORTANT
====================================================

Preserve the identity of every supplied Fashion Model throughout the editorial campaign.

Preserve every supplied garment exactly as provided, including silhouette, construction, proportions, fabric behaviour, texture, colours, patterns, trims and overall styling.

The supplied reference images exist only to identify the Fashion Models and garments. Never recreate, imitate or closely resemble their original composition, pose, camera angle or background.

Create an entirely new luxury editorial campaign inside the selected Editorial World.

The garments remain the primary visual subject. Architecture, lighting, atmosphere and styling should enhance the garments without overpowering them.

Produce a premium medium-format fashion photograph with authentic human anatomy, natural expressions, refined lighting and magazine-quality realism suitable for an international luxury fashion publication.

`.trim();

  }

  // ===========================================================================
  // AVOID
  // ===========================================================================

  private avoidSection(
    world: EditorialWorld,
    heroCount: number
): string {

    return `

====================================================
AVOID
====================================================

${world.negativePrompts}

- Do not create additional Fashion Models.

- Do not alter, redesign or invent garments.

- Do not recreate the supplied reference photographs.

- Avoid unrealistic anatomy, distorted faces, poor fabric rendering, low-quality lighting or artificial-looking editorial scenes.

====================================================
FINAL REQUIREMENTS
====================================================

Before completing the image, verify that:

- Exactly ${heroCount} supplied Fashion Models are clearly visible.

- Every Fashion Model appears exactly once.

- Every supplied garment is preserved.

- The Editorial World is respected.

- The garments remain the primary visual subject.

`.trim();

  }

}