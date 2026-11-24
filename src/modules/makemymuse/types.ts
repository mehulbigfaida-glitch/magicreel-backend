export type GenderPresentation = "female" | "male" | "androgynous";
export type SkinDirection = "reference" | "warm" | "cool" | "neutral" | "explore";
export type RefinementOptions = {
  eyes?: "natural" | "almond" | "soft-round" | "defined" | "lifted";
  faceShape?: "soft-oval" | "heart" | "round" | "defined" | "long";
  hair?: "long-waves" | "straight" | "soft-curls" | "short" | "layered";
  lips?: "balanced" | "fuller" | "soft" | "defined";
};
export type MuseCreativeBrief = {
  genderPresentation: GenderPresentation;
  apparentAge: number;
  skinDirection: SkinDirection;
  transformationDirection?: string;
  refinement?: RefinementOptions;
};
export type PromptBuildResult = {
  promptVersion: string;
  prompt: string;
  manifest: Record<string, unknown>;
};
