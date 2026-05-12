interface EditorialDraftPromptInput {
  editorialWorld: string;

  output: string;
}

/* =========================================
   OUTPUTS
========================================= */

const OUTPUT_DIRECTION: Record<
  string,
  string
> = {
  "instagram-post": `
Generate a native portrait luxury editorial image designed for premium Instagram fashion campaigns.

The composition must feel naturally portrait-oriented with strong couture editorial framing and balanced luxury negative space.

The model and garment must remain the immediate visual focus of the image with confident editorial presence and premium fashion-house proximity.

Avoid:
- distant subject scaling
- excessive environmental dominance
- tiny full-body framing
- cathedral-scale pullback compositions
- widescreen cinematic framing
- horizontal layouts
- panoramic composition
- empty side expansion
- letterboxed cinematic crops

Maintain elegant breathing room while preserving strong garment visibility and premium editorial dominance.

The final image should feel like an authentic luxury magazine campaign photographed for a world-class couture fashion house.
`,

  story: `
Generate a vertical luxury fashion story composition optimized for immersive mobile-first editorial storytelling.

Maintain strong vertical framing, elegant fashion hierarchy, cinematic restraint, and premium luxury atmosphere.

Avoid:
- horizontal framing
- panoramic layouts
- excessive side spacing
- environmental overexpansion
- distant cinematic pullback

The final result should feel immersive, premium, vertical, and editorial-first.
`,
};

/* =========================================
   WORLD REGISTRY
========================================= */

const WORLD_DIRECTION: Record<
  string,
  string
> = {
  "lago-eleganza": `
Create a luxury European resort editorial campaign inspired by elite Italian lakeside fashion culture and quiet aristocratic leisure.

Environment may include:
lakefront villas,
Mediterranean terraces,
sunlit promenades,
grand hotel corridors,
European resort architecture,
soft archways,
stone textures,
or elegant waterfront settings.

Lighting should feel:
warm European sunlight,
soft cinematic diffusion,
gentle shadow depth,
and natural luxury realism.

The mood should feel:
quiet wealth,
effortless elegance,
editorial leisure,
and understated couture luxury.

Preserve realistic luxury fashion photography aesthetics with premium editorial restraint.

Avoid:
tourist photography,
artificial glamour,
fantasy styling,
or exaggerated AI stylization.
`,

  "chromatic-glamour": `
Create a bold luxury fashion editorial campaign inside a high-fashion chromatic studio world inspired by modern couture pop luxury campaigns.

The environment should feature:
monochromatic studio architecture,
graphic geometry,
clean sculptural forms,
controlled shadows,
minimal luxury staging,
and saturated editorial color harmony.

The image should feel:
fashion-forward,
confident,
minimal,
glamorous,
expensive,
and emotionally restrained.

Preserve:
crisp garment rendering,
luxury realism,
editorial polish,
and premium magazine aesthetics.

Avoid:
influencer energy,
cheerful commercial styling,
busy environments,
or artificial CGI aesthetics.
`,

  "runway-silence": `
Create a restrained luxury runway editorial inspired by European fashion-house minimalism and timeless couture tailoring.

Environment should feel:
minimal,
gallery-like,
architectural,
silent,
emotionally restrained,
and visually expensive through simplicity.

The image should prioritize:
tailoring geometry,
fabric realism,
sculptural silhouettes,
quiet editorial confidence,
and luxury restraint.

Avoid:
busy storytelling,
tourist environments,
commercial smiling,
oversaturated color,
or dramatic theatrical energy.
`,

  "alpine-nomad": `
Create a cinematic luxury campaign set inside a cold alpine wilderness inspired by aristocratic expedition fashion and rugged couture realism.

Environment may include:
snow landscapes,
mountain terrain,
frozen rivers,
winter forests,
cold atmospheric depth,
or cinematic alpine isolation.

The mood should feel:
emotionally restrained,
rugged yet elegant,
cinematic,
remote,
and fashion-house refined.

Avoid:
sporty ski aesthetics,
tourist imagery,
fantasy environments,
or exaggerated stylization.
`,

  "sculpted-riviera": `
Create a sculptural Mediterranean luxury editorial inspired by avant-garde Riviera architecture and artistic coastal minimalism.

Environment may include:
curved stone architecture,
Mediterranean geometry,
warm limestone textures,
minimalist luxury surfaces,
artistic shadows,
and sculptural coastal spaces.

The image should feel:
architectural,
graphic,
elegant,
restrained,
and globally recognizable as luxury fashion branding.

Avoid:
streetwear energy,
casual posing,
tourist imagery,
or busy environments.
`,

  "mediterranean-heirloom": `
Create a cinematic Mediterranean couture campaign photographed in historic Southern Europe during warm golden-hour light.

Environment may include:
aged limestone architecture,
heritage archways,
Mediterranean streets,
rustic European textures,
and old-world travel atmosphere.

The image should feel:
elegant,
emotionally restrained,
naturally cinematic,
and editorial rather than commercial.

Maintain:
asymmetrical editorial realism,
luxury travel atmosphere,
and refined environmental storytelling.

Avoid:
tourist-photo aesthetics,
catalog posing,
or artificial perfection.
`,

  "celestial-silence": `
Create a surreal luxury editorial inside a quiet atmospheric world filled with emotional silence and cinematic negative space.

Environment may include:
reflective lakes,
distant mountains,
midnight-blue skies,
floating lantern lights,
soft atmospheric fog,
or dreamlike open landscapes.

Lighting should feel:
soft moonlit ambience,
subtle cyan glow,
gentle cinematic gradients,
and natural shadow softness.

The mood should feel:
contemplative,
emotionally quiet,
elegant,
and visually infinite.

Avoid:
chaotic fantasy imagery,
aggressive effects,
or artificial CGI behavior.
`,

  "garden-nostalgia": `
Create a nostalgic couture editorial inspired by forgotten aristocratic gardens and fading romantic memory.

Environment may include:
weathered stone ruins,
abandoned estate pathways,
overgrown botanical landscapes,
soft mountain horizons,
or poetic old-world garden spaces.

The image should feel:
melancholic,
quiet,
restrained,
timeless,
and emotionally distant.

Lighting should feel:
faded natural daylight,
soft atmospheric haze,
aged medium-format realism,
and muted cinematic softness.

Avoid:
commercial glamour,
fashion-model theatrics,
or exaggerated sensuality.
`,

  "dark-aristocracy": `
Luxury black-and-white aristocratic couture editorial photographed with restrained medium-format realism inside an emotionally silent old-world luxury environment.

Environment may include:
aged European interiors,
shadowed palace halls,
historic manor rooms,
gallery-like architectural spaces,
ornamental stone corridors,
candlelit salons,
museum-inspired chambers,
or sculptural old-world luxury settings.

Each generation should feel visually distinct while remaining inside the same aristocratic couture universe.

The composition must prioritize:
garment visibility,
luxury editorial realism,
subject dominance,
cinematic restraint,
and elegant environmental balance.

The model should appear emotionally restrained, naturally poised, observant, and quietly detached without theatrical posing or exaggerated fashion energy.

Lighting should feel:
soft sculptural monochrome realism,
analog tonal depth,
matte cinematic texture,
subtle shadow falloff,
and medium-format photographic softness.

Preserve:
garment identity,
embroidery realism,
luxury textile behavior,
silhouette integrity,
facial realism,
and couture proportions.

Avoid:
commercial glamour,
influencer aesthetics,
excessive environmental dominance,
cathedral-scale distance,
symmetrical tunnel compositions,
fantasy styling,
CGI environments,
aggressive contrast,
or repetitive architectural layouts.

The final image should feel like an authentic couture editorial photographed for a historic luxury fashion house with quiet emotional restraint and timeless monochrome realism.
`,
};

/* =========================================
   MAIN BUILDER
========================================= */

export function buildEditorialDraftPrompt(
  input: EditorialDraftPromptInput
) {
  const worldDirection =
    WORLD_DIRECTION[
      input.editorialWorld
    ] || "";

  const outputDirection =
    OUTPUT_DIRECTION[
      input.output
    ] || "";

  return `
Use the uploaded hero garment image as the primary subject reference.

Preserve exactly:
- garment design
- silhouette
- tailoring structure
- embroidery
- textile realism
- fabric behavior
- garment proportions
- luxury detailing
- facial identity realism
- body proportions

Do not redesign the garment.

${worldDirection}

Brand logo:

The second provided image is the official brand logo.

Integrate the logo subtly as a refined luxury editorial signature.

Preserve the original logo design exactly without reinterpretation.

The logo must remain:
- small
- discreet
- visually secondary
- naturally embedded into the composition

Avoid:
- oversized branding
- logo distortion
- decorative reconstruction
- floating patches
- dominant commercial placement

If no second image is provided, do not generate or invent any brand logo, watermark, text mark, or branding element.

${outputDirection}
`;
}