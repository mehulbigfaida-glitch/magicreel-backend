interface EditorialDraftPromptInput {
  editorialWorld: string;

  output: string;
}

/* =========================================
   RANDOM HELPER
========================================= */

function randomItem(
  items: string[]
) {
  return items[
    Math.floor(
      Math.random() *
        items.length
    )
  ];
}

/* =========================================
   LIGHTWEIGHT VARIATION LAYER
========================================= */

const POSE_VARIATIONS = [
  "subtle torso rotation with quiet editorial restraint",
  "gentle shoulder imbalance and observational stillness",
  "naturally evolving couture posture with restrained asymmetry",
  "slightly interrupted movement with emotional distance",
  "quiet architectural interaction with sculptural body language",
  "soft editorial asymmetry with relaxed luxury composure",
];

const COMPOSITION_VARIATIONS =
  [
    "slightly asymmetrical editorial framing with controlled negative space",
    "architectural depth with restrained visual hierarchy",
    "editorial stillness with subtle environmental layering",
    "luxury campaign composition with natural optical imperfection",
  ];

const LIGHTING_VARIATIONS = [
  "soft sculptural editorial lighting with analog tonal depth",
  "cinematic directional lighting with restrained luxury contrast",
  "matte medium-format lighting realism with gentle shadow falloff",
  "subtle atmospheric illumination with natural skin realism",
  "luxury fashion-house lighting with dimensional softness",
  "quiet cinematic light behavior with restrained highlights",
];

/* =========================================
   OUTPUTS
========================================= */

const OUTPUT_DIRECTION: Record<
  string,
  string
> = {
  "instagram-post": `
Luxury fashion editorial composition optimized for Instagram portrait presentation.

Prefer elegant vertical 4:5 framing with balanced cinematic composition, natural environmental depth, and sophisticated editorial spacing.

The composition should feel like a real luxury fashion campaign photographed for a premium maison advertisement.

Maintain:
- cinematic realism
- environmental storytelling
- natural asymmetry
- architectural depth
- luxury negative space
- editorial optical balance

Avoid:
- landscape cinematic crops
- panoramic framing
- ultra-wide environmental layouts

The image should remain visually immersive and editorial rather than rigidly centered or poster-like.
`,

  story: `
Strict vertical cinematic story composition optimized for immersive mobile-first luxury storytelling.

The final image must remain vertically framed for premium fashion story presentation.

Avoid:
- horizontal framing
- landscape layouts
- panoramic composition
- wide cinematic crops
- excessive empty side spacing

Maintain strong vertical visual flow with immersive editorial depth.
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
Create a luxury European resort editorial campaign set in an elegant Italian lakeside world inspired by quiet aristocratic leisure and couture vacation culture.

The scene should feel cinematic, refined, and emotionally restrained — capturing the atmosphere of elite summer life around Lake Como.

Environment should include sophisticated European resort elements such as:
luxury lakefront villas,
stone terraces,
Mediterranean gardens,
grand hotel corridors,
sunlit promenades,
lakeside balconies,
outdoor cafés,
parasols,
soft architectural archways,
classic European textures,
or elegant waterfront settings.

Lighting must feel like soft natural European sunlight with warm cinematic diffusion, gentle highlights, realistic shadow depth, golden late-afternoon atmosphere, and luxurious ambient glow.

The emotional tone should feel:
quiet wealth,
resort aristocracy,
effortless elegance,
soft prestige,
editorial leisure,
polished vacation sophistication,
and understated couture luxury.

Maintain realistic editorial photography aesthetics with:
natural skin texture,
authentic fabric behavior,
luxury fashion photography realism,
premium cinematic composition,
high-end magazine quality,
and elegant visual restraint.

Avoid overly dramatic fashion poses, exaggerated AI stylization, fantasy environments, cyberpunk aesthetics, extreme saturation, surrealism, or artificial-looking lighting.

The result must feel like an authentic luxury resort editorial campaign photographed in an elite Italian lakeside destination.
`,

  "chromatic-glamour": `
Create a high-fashion luxury editorial campaign inside a bold chromatic studio environment inspired by modern Gucci-style pop luxury campaigns.

The image must feel:
vibrant,
glamorous,
youthful,
expensive,
clean,
graphic,
fashion-forward,
minimalist yet bold.

The environment should feature:
a single dominant saturated luxury color world,
monochromatic studio architecture,
clean geometric blocks,
sculptural negative space,
minimal set design,
controlled hard shadows,
and glossy luxury atmosphere.

Allow:
standing poses,
seated poses,
leaning poses,
geometric interaction,
elegant asymmetry,
and strong fashion posture.

The emotional tone should feel:
cool,
glamorous,
emotionally restrained,
fashion elite,
confident,
and modern luxury.

Never cheerful or influencer-like.

Ultra realistic luxury fashion photography.
Luxury campaign quality.
Crisp garment rendering.
Premium magazine aesthetics.
`,

  "runway-silence": `
Create an ultra-luxury fashion editorial campaign photograph in the aesthetic language of restrained European runway minimalism and silent luxury tailoring.

The image should feel emotionally restrained, architecturally clean, psychologically calm, and visually expensive through simplicity alone.

Environment must feel:
gallery-like,
minimal,
sculptural,
silent,
composed,
emotionally detached,
timeless,
and fashion-house minimal.

Model direction:
emotionally restrained expression,
confident stillness,
anti-commercial energy,
relaxed luxury posture,
natural hand placement,
editorial body language,
and quiet authority.

Material rendering must prioritize:
tailoring geometry,
drape realism,
structured silhouettes,
luxury fabric depth,
and premium textile realism.

Avoid:
travel environments,
fantasy styling,
commercial smiling,
busy backgrounds,
oversaturated colors,
and dramatic storytelling.

The image should feel like timeless runway archive photography photographed for an elite European maison.
`,

  "alpine-nomad": `
Create a cinematic luxury fashion-house campaign set in an alpine wilderness world inspired by nomadic winter aristocracy, expedition luxury, and rugged couture storytelling.

Environment should feature:
vast alpine snow landscapes,
cinematic mountain terrain,
frozen rivers,
snow-covered forests,
cold atmospheric depth,
cinematic snowfall,
expansive wilderness scale,
and remote luxury-travel atmosphere.

Visual language must feel:
wilderness sophistication,
rugged aristocratic elegance,
emotionally restrained,
cinematic expedition fashion,
frontier couture realism,
and fashion-house storytelling photography.

Model behavior:
emotionally restrained luxury confidence,
cinematic solitude,
nomadic elegance,
controlled movement,
wilderness composure,
and rugged editorial presence.

Avoid:
tourist photography,
camping aesthetics,
sporty ski-advertisement energy,
fantasy CGI environments,
and exaggerated AI stylization.
`,

  "sculpted-riviera": `
Create a luxury fashion-house campaign set in a sculptural Mediterranean architectural world inspired by avant-garde Riviera modernism and artistic coastal geometry.

Environment should feature:
monumental curved Mediterranean architecture,
sculptural cream stone surfaces,
organic architectural openings,
warm limestone textures,
minimalist luxury geometry,
Mediterranean sky,
and artistic shadow patterns.

Visual language must feel:
sculptural,
graphic,
emotionally restrained,
elegant,
architectural,
expensive,
editorial,
and globally recognizable luxury branding.

Model behavior:
statuesque editorial posing,
emotionally detached luxury confidence,
elongated silhouette emphasis,
controlled gestures,
graphic body positioning,
and fashion-editorial restraint.

Avoid:
tourist photography,
casual posing,
busy backgrounds,
street-style aesthetics,
lifestyle influencer mood,
and fantasy rendering.
`,

  "mediterranean-heirloom": `
Create a cinematic luxury Mediterranean fashion campaign photographed in historic Southern Europe during golden-hour sunlight.

Environment should feel:
aged limestone architecture,
ancient Mediterranean streets,
heritage archways,
warm stone textures,
rustic European atmosphere,
old-world luxury,
and cinematic travel editorial energy.

The model should feel:
emotionally distant,
elegant but unposed,
introspective,
naturally captured mid-movement,
aristocratic yet effortless,
and cinematic rather than commercial.

Composition should feel like:
a real luxury maison campaign with slightly asymmetrical framing,
environmental storytelling,
cinematic negative space,
subtle imperfection,
premium editorial realism,
and sophisticated travel narrative.

Avoid:
catalog posing,
centered ecommerce framing,
tourist-photo aesthetics,
flat lighting,
fantasy styling,
and artificial AI perfection.
`,

  "celestial-silence": `
Create a cinematic luxury editorial image in the “Celestial Silence” world.

The scene must feel emotionally quiet, surreal, contemplative, and visually infinite.

Place the model inside a vast atmospheric landscape with strong negative space and cinematic emotional silence.

Environment inspiration:
reflective dark lake,
distant mountain silhouettes,
atmospheric fog,
luminous dusk horizon,
floating lantern lights,
endless midnight-blue sky,
soft cinematic gradients,
and dreamlike open voids.

Lighting behavior:
soft moonlit blue ambience,
subtle cyan atmospheric glow,
warm floating lantern illumination,
delicate cinematic rim lighting,
and natural shadow falloff.

Pose direction:
quiet,
introspective,
emotionally restrained,
naturally elegant,
and emotionally present.

The image should feel like a frame from an expensive surreal luxury fashion film.
`,

  "garden-nostalgia": `
Create a fading-memory couture editorial inspired by forgotten aristocratic gardens, abandoned estate pathways, weathered stone ruins, overgrown wild grass, softened mountain horizons, and nostalgic botanical silence.

The atmosphere should feel:
poetic,
melancholic,
emotionally distant,
and suspended in time.

The posture should feel:
naturally elegant,
emotionally inward,
restrained,
softened,
quiet,
and cinematically still.

Lighting should feel:
faded natural daylight,
atmospheric haze,
muted highlights,
softened directional falloff,
aged medium-format realism,
and weathered cinematic softness.

Avoid:
fashion-model posing,
glamour energy,
influencer aesthetics,
commercial bridal styling,
exaggerated movement,
and artificial sensuality.

The final image should feel like a timeless couture photograph captured inside a fading romantic memory.
`,

  "dark-aristocracy": `
Luxury black-and-white aristocratic couture editorial photographed with restrained medium-format realism inside an emotionally silent old-world luxury environment.

The environment should naturally evolve across generations while remaining inside the same aristocratic cinematic universe.

Possible environmental interpretations include:
candlelit palace interiors,
aged European manor corridors,
shadowed neoclassical halls,
museum-like gallery chambers,
weathered stone architecture,
cathedral-inspired passageways,
dark velvet salons,
historic aristocratic libraries,
grand stair halls,
ornamental heritage interiors,
sculptural palace rooms,
or emotionally restrained architectural spaces with aged luxury textures.

Avoid repeatedly generating the same corridor, archway, tunnel, or identical spatial composition.

Each generation should feel like a different cinematic location photographed within the same old-world aristocratic fashion universe.

Editorial fashion-house composition with natural garment visibility, cinematic spatial balance, elegant negative space, and emotionally restrained framing.

The model is captured in an emotionally interrupted moment with sculptural asymmetry, quiet psychological distance, relaxed aristocratic restraint, and naturally evolving editorial body language.

The posture should feel observational rather than performative with:
subtle body rotation,
gentle shoulder imbalance,
elongated neck tension,
quiet incidental hand placement,
soft directional movement,
and emotionally detached presence.

The figure should appear inward, unaware of the camera, and suspended within a moment of timeless aristocratic stillness.

Lighting should feel:
soft sculptural studio realism,
analog monochrome tonal depth,
matte cinematic texture,
medium-format photographic softness,
aged shadow behavior,
and subtle optical imperfection.

Preserve:
garment identity,
couture texture,
embroidery realism,
silhouette integrity,
facial character,
luxury material behavior,
and full-length garment proportions while allowing naturally evolving editorial posture and environmental storytelling.

The garment should remain visually important while allowing natural editorial asymmetry, cinematic environmental storytelling, and emotionally organic composition balance.

Avoid rigid centered placement or symmetrical catalog framing.

Avoid:
commercial fashion energy,
influencer aesthetics,
exaggerated glamour,
theatrical posing,
artificial beauty treatment,
fantasy styling,
dramatic CGI environments,
repetitive architectural layouts,
identical arches,
symmetrical tunnel compositions,
aggressive contrast,
or catalog posture.

The image should feel like a rare couture editorial photographed for an old-world luxury fashion house with emotional restraint, sculptural silence, timeless aristocratic realism, and quiet editorial power.
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

  const poseVariation =
    randomItem(
      POSE_VARIATIONS
    );

  const compositionVariation =
    randomItem(
      COMPOSITION_VARIATIONS
    );

  const lightingVariation =
    randomItem(
      LIGHTING_VARIATIONS
    );

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

If a brand logo is provided, place it subtly and naturally like a real luxury fashion campaign brand mark.

Keep the original logo design unchanged.

Avoid oversized or distorted logo rendering.

Pose refinement:
${poseVariation}

Composition refinement:
${compositionVariation}

Lighting refinement:
${lightingVariation}

${outputDirection}
`;
}