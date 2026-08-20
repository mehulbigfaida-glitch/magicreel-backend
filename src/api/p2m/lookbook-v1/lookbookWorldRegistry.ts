export type LookbookWorldDefinition = {
  id: string;
  name: string;
  description: string;
  environment: string;
  lighting: string;
  composition: string;
  styling: string;
  poseDirection: string;
  accessoryDirection: string;
  negativeRules: string[];
};

export const LOOKBOOK_WORLD_REGISTRY: Record<
  string,
  LookbookWorldDefinition
> = {
  "designer-marketplace": {
    id: "designer-marketplace",
    name: "Designer Marketplace",
    description:
      "Premium designer-commerce presentation where the garment is treated as the primary commercial product.",

    environment:
      "A refined contemporary luxury studio with clean neutral architecture, subtle premium surfaces and controlled negative space.",

    lighting:
      "Soft even diffused studio lighting with accurate colour reproduction, controlled shadows and strong garment-detail visibility.",

    composition:
      "Balanced full-body commercial compositions with clear product framing, strong silhouette visibility and minimal environmental distraction.",

    styling:
      "Polished restrained styling appropriate for a premium designer marketplace. Styling must support the product rather than compete with it.",

    poseDirection:
      "Confident controlled fashion poses designed to communicate garment construction, silhouette, fit and craftsmanship.",

    accessoryDirection:
      "Use only restrained accessories appropriate to the garment. Accessories must never dominate or obscure the product.",

    negativeRules: [
      "Do not create distracting environments.",
      "Do not use exaggerated editorial movement.",
      "Do not over-style the model.",
      "Do not obscure important garment details."
    ]
  },

  "ethnic-luxe": {
    id: "ethnic-luxe",
    name: "Ethnic Luxe",
    description:
      "Sophisticated Indian luxury presentation combining refined ethnic styling, craftsmanship visibility and appropriate premium jewellery.",

    environment:
      "A refined luxury Indian environment with elegant heritage-inspired architecture, premium stone, subtle cultural detailing and controlled spatial richness.",

    lighting:
      "Warm diffused luxury lighting with dimensional highlights that reveal embroidery, borders, fabric texture and craftsmanship.",

    composition:
      "Elegant full-body fashion compositions with graceful framing and enough space to clearly read ethnic garment construction and drape.",

    styling:
      "Sophisticated contemporary Indian styling appropriate to the garment, occasion and silhouette. The styling must feel premium rather than theatrical.",

    poseDirection:
      "Graceful ethnic fashion posing with deliberate hand gestures, elegant torso angles and controlled garment presentation.",

    accessoryDirection:
      "Jewellery is an intentional part of Ethnic Luxe styling. Add tasteful, garment-appropriate premium ethnic jewellery such as elegant earrings, bangles or a suitable necklace where appropriate. Jewellery must complement the garment and remain subordinate to important garment details.",

    negativeRules: [
      "Do not omit appropriate jewellery when the garment and styling call for it.",
      "Do not use excessive bridal jewellery.",
      "Do not allow jewellery to hide embroidery, neckline, border or pallu.",
      "Do not reinterpret the garment as another ethnic category.",
      "Do not let the environment overpower the garment."
    ]
  },

  "modern-minimal": {
    id: "modern-minimal",
    name: "Modern Minimal",
    description:
      "Clean contemporary fashion presentation with architectural simplicity, restrained styling and powerful garment focus.",

    environment:
      "A sophisticated minimalist contemporary interior or studio with clean geometric architecture, neutral surfaces and generous negative space.",

    lighting:
      "Bright controlled diffused lighting with subtle directional modelling and accurate colour rendering.",

    composition:
      "Clean full-body editorial-commerce compositions with strong silhouette definition and deliberate negative space.",

    styling:
      "Minimal contemporary styling with very limited accessories and no unnecessary decorative elements.",

    poseDirection:
      "Controlled contemporary poses using elegant asymmetry, subtle hand positioning and strong silhouette communication.",

    accessoryDirection:
      "Minimal accessories only. Jewellery should be restrained and used only where it naturally supports the garment.",

    negativeRules: [
      "Do not crowd the frame.",
      "Do not use excessive jewellery.",
      "Do not introduce unnecessary props.",
      "Do not use theatrical posing.",
      "Do not let styling compete with the garment."
    ]
  },

  "editorial-couture": {
    id: "editorial-couture",
    name: "Editorial Couture",
    description:
      "Sophisticated fashion-magazine presentation with expressive composition and elevated couture energy.",

    environment:
      "A refined high-fashion editorial environment combining premium architecture or studio space with controlled visual depth.",

    lighting:
      "Cinematic fashion lighting with sculptural highlights, refined contrast and premium depth while maintaining garment colour accuracy.",

    composition:
      "More expressive fashion-editorial compositions with stronger spatial relationships, elegant asymmetry and elevated framing.",

    styling:
      "High-fashion styling appropriate to the garment, more expressive than marketplace presentation but never altering the product.",

    poseDirection:
      "Sophisticated editorial poses using controlled asymmetry, elegant gestures, refined torso angles and carefully managed garment movement.",

    accessoryDirection:
      "Selective fashion accessories may be introduced when appropriate to the garment and styling direction. Jewellery must support the fashion story without overwhelming the product.",

    negativeRules: [
      "Do not sacrifice garment visibility for editorial drama.",
      "Do not redesign or reinterpret the garment.",
      "Do not introduce distracting theatrical props.",
      "Do not distort garment construction through posing."
    ]
  },

  "bridal-couture": {
    id: "bridal-couture",
    name: "Bridal Couture",
    description:
      "Grand couture bridal presentation where garment craftsmanship, luxurious styling and elaborate bridal jewellery form one coordinated fashion story.",

    environment:
      "An opulent but controlled couture environment inspired by luxury wedding architecture, heritage interiors and refined ceremonial spaces.",

    lighting:
      "Warm luminous couture lighting with refined highlights that bring out embroidery, zari, stones, metallic work and rich textile surfaces.",

    composition:
      "Grand full-body couture compositions with elegant spatial scale, strong garment visibility and deliberate bridal portrait sophistication.",

    styling:
      "Luxurious bridal styling appropriate to the garment, with elevated posture and a complete couture presentation.",

    poseDirection:
      "Regal couture poses with elegant posture, deliberate hand placement, controlled torso angles and graceful garment presentation.",

    accessoryDirection:
      "Jewellery is a major component of Bridal Couture. Use elaborate, coordinated bridal jewellery appropriate to the garment and occasion, potentially including statement earrings, layered necklaces, bangles, maang tikka and other culturally appropriate bridal pieces. Jewellery should feel rich and luxurious but must never obscure important garment construction.",

    negativeRules: [
      "Do not use casual or minimal jewellery.",
      "Do not omit bridal jewellery when the garment is presented as bridal couture.",
      "Do not introduce culturally inappropriate jewellery.",
      "Do not allow jewellery to obscure embroidery, pallu, neckline or other garment details.",
      "Do not change the garment's construction, silhouette or embellishment."
    ]
  }
};

export function getLookbookWorld(
  worldId: string
): LookbookWorldDefinition | null {

  const normalizedWorld =
    worldId.trim().toLowerCase();

  return (
    LOOKBOOK_WORLD_REGISTRY[normalizedWorld] ||
    null
  );
}