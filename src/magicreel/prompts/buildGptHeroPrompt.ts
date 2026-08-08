export interface BuildGptHeroPromptRequest {
  categoryKey: string;
  avatarGender: string;
  styling?: string;
  heroView: "front" | "back";
}

export function buildGptHeroPrompt(
  request: BuildGptHeroPromptRequest
): string {

  const {
    categoryKey,
    avatarGender,
    styling,
    heroView,
  } = request;

  const sections: string[] = [];

  /* ==========================================================
     SOURCE OF TRUTH
  ========================================================== */

  function buildSourceOfTruthSection(): string {

    return `
The first uploaded image is the garment image and is the absolute source of truth.

Transfer the uploaded garment onto the provided full-body fashion model.

The uploaded model is the body reference only.

Completely replace the model's clothing with the uploaded garment.

Preserve the garment exactly as shown in the garment image.
`.trim();

  }

  /* ==========================================================
     BODY REFERENCE
  ========================================================== */

  function buildBodyReferenceSection(): string {

    return `
The second uploaded image is the full-body fashion model reference.

Use the model image as the absolute reference for the model's body proportions, body shape, face, hairstyle, skin appearance, hands, arms, legs and overall physical identity.

Do not redesign, slim, enlarge, reshape or otherwise alter the model's body.

Preserve the model's natural body proportions.

The garment must be fitted naturally to this specific body.

Do not force the garment onto an unrealistically different body shape.

The final garment fit must respect the model's actual body volume, proportions and anatomy.
`.trim();

  }

  /* ==========================================================
     GARMENT PRESERVATION
  ========================================================== */

  function buildGarmentPreservationSection(): string {

    return `
The garment is a finished commercial fashion product, not a design reference.

Treat the garment as immutable.

Do not redesign, reinterpret, restyle, simplify, improve, tailor, enhance, symmetrize or modify any part of the garment.

Every visible construction detail must be reproduced exactly.

Preserve with 100% accuracy:

• garment silhouette
• garment proportions
• garment structure
• neckline
• collar
• shoulders
• sleeves
• cuffs
• armholes
• stitching
• seams
• fabric texture
• fabric drape
• fabric weight
• garment volume
• pleats
• gathers
• embroidery
• mirror work
• lace
• trims
• tassels
• embellishments
• prints
• graphics
• logos
• labels
• branding
• colour accuracy
• pattern alignment
• scale and position of every design element

Preserve the original garment construction even where the garment is naturally folded, rolled, draped or slightly un-ironed in the source image.

Do not artificially straighten, iron, sharpen or beautify the garment.

Maintain realistic fabric behaviour while preserving the original product.
`.trim();

  }

  /* ==========================================================
     CATEGORY COMPLETION
  ========================================================== */

  function buildCategoryCompletionSection(
    category: string
  ): string {

    const normalizedCategory =
      category.trim().toLowerCase();

    if (
      normalizedCategory === "top" ||
      normalizedCategory === "shirt" ||
      normalizedCategory === "only top"
    ) {

      return `
The uploaded garment is an upper-body garment only.

Complete the missing portion of the outfit with an appropriate full-length bottom wear.

The bottom wear must be neutral, commercially appropriate and visually understated.

It must fit naturally according to the model's body proportions.

The uploaded garment is the primary product and must remain the visual focus.

Do not generate shorts.

Do not generate cropped bottoms.

Do not generate transparent bottoms.

Do not introduce distracting prints, logos, embroidery or fashion elements into the bottom wear.
`.trim();

    }

    if (
      normalizedCategory === "bottom" ||
      normalizedCategory === "only bottom"
    ) {

      return `
The uploaded garment is a lower-body garment only.

Complete the missing portion of the outfit with an appropriate upper garment.

The upper garment must be neutral, commercially appropriate and visually understated.

It must fit naturally according to the model's body proportions.

The uploaded garment is the primary product and must remain the visual focus.

Do not introduce bold prints, heavy embroidery, logos or distracting fashion elements into the upper garment.
`.trim();

    }

    if (
      normalizedCategory === "ethnic_set" ||
      normalizedCategory === "ethnic set" ||
      normalizedCategory === "set"
    ) {

return `
The uploaded garment represents a complete coordinated outfit.

Reproduce the complete outfit exactly as provided.

Do not omit, replace or reinterpret any component of the outfit.

Preserve the relationship, layering, proportions and construction of every component exactly as shown.

For ethnic wear, style the model with elegant heels or refined heeled footwear appropriate to the outfit.

Do not use flat chappals, flat sandals, slippers or barefoot styling.

Allow GPT to select the most appropriate ethnic heel style for the garment.

The footwear should complement the outfit and create an elegant, elongated fashion silhouette without becoming visually dominant.
`.trim();

    }

    if (
      normalizedCategory === "dress" ||
      normalizedCategory === "gown"
    ) {

      return `
The uploaded garment represents the complete outfit.

Do not generate additional garments.

Replace the model's clothing completely with the uploaded garment.

Preserve the complete silhouette and construction of the garment exactly as shown.
`.trim();

    }

    return `
Treat the uploaded garment as the primary clothing product.

Complete only any clothing that is genuinely missing from the uploaded garment with an appropriate, neutral, full-length fashion garment.

Do not introduce unnecessary styling elements.

The uploaded garment must remain the dominant visual subject.
`.trim();

  }

  /* ==========================================================
     STYLING
  ========================================================== */

  function buildStylingSection(
    stylingValue?: string
  ): string {

    if (!stylingValue) {
      return "";
    }

    const normalizedStyling =
      stylingValue.trim().toLowerCase();

    if (normalizedStyling === "tucked") {

      return `
Style the uploaded upper garment in a naturally tucked presentation.

The tuck must look physically realistic and must not alter the garment's original construction, proportions or design.

Maintain realistic fabric tension and folds around the waist.
`.trim();

    }

    if (normalizedStyling === "untucked") {

      return `
Style the uploaded upper garment naturally untucked.

Preserve the original hemline, garment length and silhouette exactly.

Allow the garment to fall naturally over the lower garment according to realistic fabric physics.

Do not artificially shorten, lengthen, reshape or tailor the garment.
`.trim();

    }

    return `
Apply the selected styling instruction exactly as specified:

${stylingValue}

The styling must not alter the garment's original construction, proportions, design, colour, texture or branding.
`.trim();

  }

  /* ==========================================================
     HERO VIEW
  ========================================================== */

  function buildHeroViewSection(
    view: "front" | "back"
  ): string {

    if (view === "front") {

      return `
Generate a professional full-body front-facing fashion photograph.

The front view of the garment must be completely visible.

Preserve the complete front silhouette, neckline, front construction, front drape, front embroidery, front prints and all visible front garment details exactly.

Face the model directly toward the camera.

Do not rotate the body away from the camera.

Keep the complete garment clearly visible.
`.trim();

    }

    return `
Generate a professional full-body back-facing fashion photograph.

The back view of the garment must be completely visible.

Preserve the complete back silhouette, back neckline, back construction, back drape, back embroidery, back prints and all visible back garment details exactly.

Face the model directly away from the camera.

Do not rotate the body toward the camera.

Keep the complete garment clearly visible.
`.trim();

  }

  /* ==========================================================
     COMMERCIAL PHOTOGRAPHY
  ========================================================== */

  function buildPhotographySection(): string {

    return `
Generate a premium commercial fashion e-commerce photograph.

Use a clean soft neutral grey studio background.

Use even diffused studio lighting.

Avoid harsh shadows.

Maintain consistent lighting across the garment.

The model should stand in a relaxed natural posture.

Keep the arms naturally relaxed by the sides unless the garment requires otherwise for visibility.

Maintain realistic human anatomy.

Maintain realistic garment physics and natural fabric drape.

Ensure the garment fits naturally according to the model's actual body shape while preserving its original construction.

Do not distort the model's body to accommodate the garment.

Do not distort the garment to accommodate the body.

The garment and body must coexist naturally as they would in a real professional fashion photoshoot.

Do not crop any part of the model.

Keep the complete model visible from head to toe.

Generate a high-resolution fashion photograph suitable for luxury fashion catalogues and premium e-commerce websites.

The final image must look like a real professionally photographed commercial fashion shoot and not an AI-generated illustration.
`.trim();

  }

  /* ==========================================================
     FINAL QUALITY
  ========================================================== */

  function buildFinalQualitySection(): string {

    return `
The uploaded garment is the primary subject of the image.

The generated garment must be visually indistinguishable from the uploaded garment.

Prioritize garment fidelity over creative interpretation.

Do not introduce new design elements, styling changes, colour variations, additional embellishments or structural modifications.

Do not improve or beautify the garment beyond what exists in the source image.

Preserve authentic fabric folds, tension, drape and minor natural irregularities.

The model must remain anatomically realistic.

The garment must fit the model naturally without changing the model's body proportions.

The final result must accurately represent the commercial product exactly as it would appear in a professional fashion photoshoot.

The output should be suitable for luxury fashion catalogues, premium e-commerce listings and brand marketing assets.
`.trim();

  }

  /* ==========================================================
     BUILD FINAL PROMPT
  ========================================================== */

  sections.push(
    buildSourceOfTruthSection()
  );

  sections.push(
    buildBodyReferenceSection()
  );

  sections.push(
    buildGarmentPreservationSection()
  );

  sections.push(
    buildCategoryCompletionSection(categoryKey)
  );

  sections.push(
    buildStylingSection(styling)
  );

  sections.push(
    buildHeroViewSection(heroView)
  );

  sections.push(
    buildPhotographySection()
  );

  sections.push(
    buildFinalQualitySection()
  );

  return sections
    .filter(Boolean)
    .join("\n\n");
}