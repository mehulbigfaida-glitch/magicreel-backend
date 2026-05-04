import {
  CreativeDirection,
  ResolvedCreativeDirection,
} from "./socialPack.types";

export function resolveCreativeDirection(
  direction: CreativeDirection
): ResolvedCreativeDirection {
  switch (direction) {
    case "Luxury Editorial":
      return {
        cinematicTone:
          "premium editorial luxury fashion campaign",

        luxuryMood:
          "refined cinematic sophistication",

        compositionStyle:
          "editorial luxury composition with premium negative space and fashion campaign hierarchy",

        lightingStyle:
          "soft cinematic luxury lighting with premium skin rendering and controlled shadow depth",

        visualAtmosphere:
          "high-end fashion editorial environment with cinematic elegance",

        stylingBehavior: [
          "luxury fashion posture",
          "editorial visual balance",
          "premium campaign styling",
          "high-fashion framing discipline",
        ],

        cinematicKeywords: [
          "editorial luxury realism",
          "cinematic fashion atmosphere",
          "premium composition hierarchy",
          "couture campaign aesthetics",
        ],

        negativeKeywords: [
          "cheap ecommerce aesthetics",
          "fast-fashion visuals",
          "social media clutter",
        ],
      };

    case "Streetwear":
      return {
        cinematicTone:
          "urban luxury streetwear campaign",

        luxuryMood:
          "bold modern street fashion energy",

        compositionStyle:
          "high-contrast urban framing with aggressive focal hierarchy and social-first composition",

        lightingStyle:
          "cinematic urban contrast lighting with edgy shadows and premium modern atmosphere",

        visualAtmosphere:
          "modern luxury city environment with editorial streetwear styling",

        stylingBehavior: [
          "confident movement energy",
          "street-fashion posture",
          "urban visual pacing",
          "dynamic framing behavior",
        ],

        cinematicKeywords: [
          "urban luxury campaign",
          "streetwear editorial realism",
          "cinematic city atmosphere",
          "high-energy fashion styling",
        ],

        negativeKeywords: [
          "cheap influencer energy",
          "mall-fashion aesthetics",
          "generic streetwear posing",
        ],
      };

    case "Minimal Fashion":
      return {
        cinematicTone:
          "minimal luxury fashion editorial",

        luxuryMood:
          "quiet luxury sophistication",

        compositionStyle:
          "clean editorial spacing with minimalist visual hierarchy and refined composition restraint",

        lightingStyle:
          "soft diffused luxury lighting with elegant tonal balance",

        visualAtmosphere:
          "minimal high-fashion environment with premium restraint",

        stylingBehavior: [
          "minimal visual noise",
          "refined luxury posture",
          "editorial simplicity",
          "clean composition balance",
        ],

        cinematicKeywords: [
          "quiet luxury aesthetics",
          "minimal editorial sophistication",
          "premium visual restraint",
          "refined cinematic elegance",
        ],

        negativeKeywords: [
          "visual clutter",
          "oversaturated styling",
          "cheap glam aesthetics",
        ],
      };

    case "Festive Couture":
      return {
        cinematicTone:
          "royal festive couture campaign",

        luxuryMood:
          "celebratory cinematic grandeur",

        compositionStyle:
          "heritage luxury composition with royal spatial hierarchy and couture campaign framing",

        lightingStyle:
          "warm festive cinematic lighting with luxury highlights and premium celebratory atmosphere",

        visualAtmosphere:
          "palatial couture environment with heritage luxury richness",

        stylingBehavior: [
          "royal elegance",
          "heritage couture posture",
          "luxury festive movement",
          "cinematic grandeur",
        ],

        cinematicKeywords: [
          "royal couture atmosphere",
          "heritage luxury storytelling",
          "cinematic festive richness",
          "premium bridal elegance",
        ],

        negativeKeywords: [
          "cheap wedding photography",
          "plastic festive styling",
          "low-end commercial aesthetics",
        ],
      };

    case "High Fashion":
      return {
        cinematicTone:
          "avant-garde high fashion editorial campaign",

        luxuryMood:
          "bold couture artistic direction",

        compositionStyle:
          "experimental editorial hierarchy with dramatic fashion framing and couture visual rhythm",

        lightingStyle:
          "dramatic cinematic fashion lighting with sculpted luxury contrast",

        visualAtmosphere:
          "high-fashion runway editorial environment with artistic luxury styling",

        stylingBehavior: [
          "runway authority",
          "dramatic fashion posture",
          "editorial boldness",
          "avant-garde movement styling",
        ],

        cinematicKeywords: [
          "high-fashion editorial realism",
          "couture artistic direction",
          "luxury runway atmosphere",
          "cinematic fashion drama",
        ],

        negativeKeywords: [
          "generic fashion posing",
          "cheap influencer styling",
          "basic catalog aesthetics",
        ],
      };

    default:
      return {
        cinematicTone:
          "premium luxury fashion campaign",

        luxuryMood:
          "cinematic editorial sophistication",

        compositionStyle:
          "luxury fashion composition",

        lightingStyle:
          "premium cinematic lighting",

        visualAtmosphere:
          "high-end fashion atmosphere",

        stylingBehavior: [],

        cinematicKeywords: [],

        negativeKeywords: [],
      };
  }
}