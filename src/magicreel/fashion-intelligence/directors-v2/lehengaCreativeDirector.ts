import { CreativeDirector } from "./baseCreativeDirector.types";
import { PromptContext } from "../types/context.types";
import { CreativePlan } from "../planning/creativePlan.types";

export const LEHENGA_CREATIVE_DIRECTOR: CreativeDirector = {
  id: "lehenga-v2",

  displayName: "Lehenga Creative Director",

  supportedCategories: [
    "lehenga",
    "bridal",
  ],

  buildPlan(
    context: PromptContext
  ): Partial<CreativePlan> {

    const bridal =
      context.occasion === "bridal";

    return {

      identity: {
        director: this.displayName,

        brandDNA: "MagicReel",

        luxuryTier:
          context.luxuryTier || "couture",

        editorialStyle:
          context.mood || "editorial",
      },

      creativeGoal: {

        objective:
          bridal
            ? "Create a world-class couture bridal editorial where the lehenga becomes the undisputed hero through elegance, craftsmanship and timeless luxury."
            : "Present the lehenga as a luxury couture masterpiece while preserving every design detail.",

        audience:
          "Luxury bridal buyers, couture designers, premium retailers and international fashion magazines.",

        visualPriority: [

          "Lehenga Silhouette",

          "Embroidery",

          "Craftsmanship",

          "Dupatta",

          "Luxury Editorial Presence",

          "Garment Fidelity",
        ],
      },

      camera: {

        framing:
          "Full-length couture composition",

        angle:
          "Eye level",

        lensStyle:
          "85mm premium fashion prime",

        distance:
          "Medium",

        movement:
          "Static luxury editorial photography",
      },

      lighting: {

        style:
          "Soft sculpted couture lighting",

        mood:
          "Elegant",

        contrast:
          "Gentle cinematic contrast",

        highlights:
          "Controlled highlights preserving embroidery, zari and fabric texture",
      },

      composition: {

        layout:
          "International luxury bridal magazine composition",

        balance:
          "Elegant centred composition with premium negative space",

        focus:
          "Lehenga craftsmanship and silhouette",

        depth:
          "Natural cinematic depth",
      },

      styling: {

        wardrobePriority: [

          "Lehenga Flare",

          "Embroidery",

          "Dupatta Drape",

          "Fabric Texture",

          "Waistline",

          "Blouse Fit",
        ],

        accessoryPolicy:
          "Luxury bridal jewellery may complement the garment but must never overpower the lehenga.",

        colorStrategy:
          "Preserve original garment colours, embroidery, contrast and luxury realism.",
      },

      background: {

        environment:
          "Minimal luxury architectural interior",

        architecture:
          "Premium contemporary architecture",

        atmosphere:
          "Quiet refined couture atmosphere",
      },

      model: {

        pose:
          "Elegant couture posture naturally displaying lehenga flare and dupatta flow",

        expression:
          "Confident graceful luxury emotion",

        bodyLanguage:
          "Royal couture body language with natural elegance",
      },

      emotion: {

        emotionalTone:
          "Timeless bridal sophistication",

        energy:
          "Calm luxurious confidence",
      },

      storytelling: {

        narrative:
          bridal
            ? "A timeless couture bridal story celebrating heritage craftsmanship."
            : "An international luxury fashion editorial celebrating couture craftsmanship.",

        cinematicMoment:
          "Luxury magazine cover hero image",
      },

      quality: {

        preserveGarment: true,

        preserveEmbroidery: true,

        preserveSilhouette: true,

        avoidArtifacts: true,
      },

      packs: {

        recommended: [

          "EditorialMinimalPack",

          "BridalJewelryPack",

          "CinematicShadowPack",
        ],

        optional: [

          "HeritageArchitecturePack",
        ],
      },

      rules: {

        required: [

          "Garment Fidelity",

          "Luxury Realism",

          "Embroidery Preservation",

          "Lehenga Flare Preservation",

          "Dupatta Preservation",

          "Blouse Proportion Preservation",

          "Natural Fabric Behaviour",
        ],

        prohibited: [

          "Cheap Bridal Styling",

          "Fashion Artifacts",

          "Incorrect Draping",

          "Distorted Silhouette",

          "Hidden Dupatta",

          "Flattened Embroidery",

          "Artificial Fashion Pose",
        ],
      },
    };
  },
};