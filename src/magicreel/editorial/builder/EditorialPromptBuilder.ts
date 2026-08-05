import { getEditorialWorld } from "../registry/worlds";
import { OutputProfile } from "../registry/outputProfiles";
import { EditorialWorld } from "../types/editorial.types";

export interface EditorialPromptInput {
  worldId: string;
  output: OutputProfile;
}

export class EditorialPromptBuilder {

  build(
    input: EditorialPromptInput
  ): string {

    const world = getEditorialWorld(
      input.worldId
    );

    return [

      this.introductionSection(),

      this.primaryFashionModelSection(),

      this.additionalFashionModelsSection(),

      this.editorialWorldSection(world),

      this.editorialDirectionSection(world),

      this.outputSection(input.output),

      this.importantSection(),

      this.avoidSection(world),

    ].join("\n\n");

  }

  // ===========================================================================
  // INTRODUCTION
  // ===========================================================================

  private introductionSection(): string {

    return `

Create an entirely new luxury fashion editorial campaign inspired by the supplied Fashion Models and the selected Editorial World. Produce a premium magazine-quality photograph with authentic storytelling, refined composition, and exceptional garment presentation while preserving the identity of every supplied Fashion Model.

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
    world: EditorialWorld
  ): string {

    return `

====================================================
AVOID
====================================================

${world.negativePrompts
  .map(x => `- ${x}`)
  .join("\n")}

- Do not create additional Fashion Models.

- Do not alter, redesign or invent garments.

- Do not recreate the supplied reference photographs.

- Avoid unrealistic anatomy, distorted faces, poor fabric rendering, low-quality lighting or artificial-looking editorial scenes.

`.trim();

  }

}