export type CinematicCluster = {
name: string;

visualAnchors: string[];
compositionVariants: string[];
lightingVariants: string[];
};

export const CINEMATIC_CLUSTERS: CinematicCluster[] = [
{
name: "Runway Dramatic",

visualAnchors: [
  "dramatic runway shadow cuts",
  "avant-garde spotlight sculpting",
  "high-contrast couture staging",
  "editorial fog atmosphere",
],

compositionVariants: [
  "runway perspective compression",
  "dramatic focal hierarchy",
  "avant-garde asymmetrical framing",
],

lightingVariants: [
  "runway spotlight sculpting",
  "dramatic shadow-edge lighting",
  "cinematic couture rim lighting",
],

},

{
name: "Editorial Architectural",

visualAnchors: [
  "architectural luxury framing",
  "museum-grade shadow gradients",
  "premium negative-space staging",
  "gallery-inspired environment",
],

compositionVariants: [
  "architectural couture depth layering",
  "cinematic negative-space balancing",
  "gallery-style framing",
],

lightingVariants: [
  "soft couture spotlight falloff",
  "museum-grade ambient glow",
  "subtle shadow-gradient transitions",
],

},

{
name: "Minimal Luxury",

visualAnchors: [
  "soft matte architectural surfaces",
  "clean editorial backdrop transitions",
  "luxury tonal gradients",
],

compositionVariants: [
  "minimal center-weighted composition",
  "editorial whitespace dominance",
  "clean luxury symmetry",
],

lightingVariants: [
  "soft natural diffusion",
  "minimal ambient glow",
  "quiet tonal lighting balance",
],

},

{
name: "Urban Cinematic",

visualAnchors: [
  "wet neon street reflections",
  "urban alley cinematic depth",
  "city light motion blur",
],

compositionVariants: [
  "urban diagonal framing",
  "street-level cinematic perspective",
  "dynamic asymmetric city framing",
],

lightingVariants: [
  "neon edge reflections",
  "high-contrast street glow",
  "urban rim lighting",
],

},
];
