import { composeEditorialPrompt } from "../editorial/editorialPromptComposer";

export type HeroEditorialInput = {
  category: string;

  western?: boolean;

  bridal?: boolean;

  colorPalette?: string[];

  silhouette?: string;

  mood?: string;

  embroideryDensity?: "low" | "medium" | "high";

  jewelryHeavy?: boolean;
};

export function buildHeroEditorialPrompt(
  input: HeroEditorialInput
): string {
  const editorial = composeEditorialPrompt({
    category: input.category,

    western: input.western,

    bridal: input.bridal,

    colorPalette: input.colorPalette,

    silhouette: input.silhouette,

    mood: input.mood,

    embroideryDensity: input.embroideryDensity,

    jewelryHeavy: input.jewelryHeavy,
  });

  const sections: string[] = [];

  sections.push(
    "Luxury high-fashion editorial campaign image."
  );

  sections.push(editorial.prompt);

  sections.push(
    "Preserve garment structure, embroidery accuracy, fabric realism, silhouette precision, and luxury fashion authenticity."
  );

  sections.push(
    "Maintain cinematic editorial realism with premium fashion-house quality."
  );

  sections.push(
    "Avoid AI-looking artifacts, synthetic textures, distorted anatomy, exaggerated drama, chaotic styling, oversaturation, and low-end fashion aesthetics."
  );

  return sections.join(" ");
}