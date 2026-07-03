import { CreativeDirector } from "./baseCreativeDirector.types";
import { PromptContext } from "../types/context.types";
import { CreativePlan } from "../planning/creativePlan.types";
import { getRandomEditorialWorld } from "../editorial-worlds/editorialWorldRegistry";

export const EDITORIAL_CREATIVE_DIRECTOR: CreativeDirector = {
  id: "editorial-v2",

  displayName: "Editorial Creative Director",

  supportedCategories: [
    "lehenga",
    "saree",
    "westernwear",
    "menswear",
    "kurta",
    "bridal",
    "gown",
    "ethnicset",
    "streetwear",
  ],

  buildPlan(
    context: PromptContext
  ): Partial<CreativePlan> {

    const isBridal =
      context.occasion === "bridal";

    const isRunway =
      context.campaignType === "runway";

    const isEditorial =
      context.campaignType === "couture-editorial";

    const world =
    getRandomEditorialWorld();
    
      const objective =
      isBridal
        ? "Create an international couture bridal editorial where craftsmanship, silhouette and emotion elevate the garment into the undisputed hero."
        : "Create an international luxury fashion editorial celebrating craftsmanship, silhouette and timeless elegance.";

    const narrative =
      isBridal
        ? "A timeless couture bridal story celebrating craftsmanship and elegance."
        : isRunway
        ? "A premium runway presentation showcasing confidence, movement and luxury."
        : "A high-fashion editorial celebrating luxury craftsmanship.";

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
        objective,

        audience:
          "Luxury fashion buyers, premium designers, luxury retailers and editorial publications.",

        visualPriority: [
          "Garment Fidelity",
          "Luxury Editorial Direction",
          "Craftsmanship",
          "Silhouette",
          "Luxury Storytelling",
        ],
      },

      camera: {
        framing:
          isRunway
            ? "Full-length runway framing"
            : "Full body",

        angle:
          "Eye level",

        lensStyle:
          "85mm fashion editorial prime lens",

        distance:
          "Medium",

        movement:
          "Static luxury fashion photography",
      },

      lighting: {
  style:
    world.lighting,

  mood:
    "Sophisticated editorial luxury",

  contrast:
    "Rich cinematic contrast with sculptural depth",

  highlights:
    "Controlled couture textile highlights preserving embroidery and fabric texture",
},

      composition: {
        layout:
          "International luxury fashion magazine composition",

        balance:
          "Elegant negative space",

        focus:
          "Garment craftsmanship",

        depth:
          "Natural cinematic depth",
      },

      styling: {
        wardrobePriority: [
          "Garment",
          "Silhouette",
          "Texture",
          "Craftsmanship",
        ],

        accessoryPolicy:
          "Accessories may enhance the garment but must never overpower it.",

        colorStrategy:
          "Preserve original garment colours with luxury realism.",
      },

      background: {
  environment:
    world.description,

  architecture:
    world.name,

  atmosphere:
    "World-class luxury editorial atmosphere",
},

      model: {
        pose:
          "Elegant editorial couture pose",

        expression:
          "Confident sophisticated expression",

        bodyLanguage:
          "Natural luxury fashion body language",
      },

      emotion: {
        emotionalTone:
          "Sophisticated luxury",

        energy:
          "Calm confident elegance",
      },

      storytelling: {
  narrative:
    `${world.storytelling}

${narrative}

The environment must become a defining visual character of the campaign rather than merely a background.`,

  cinematicMoment:
    "International Vogue cover hero frame",
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
        ],

        optional: [
          "CinematicShadowPack",
        ],
      },

      rules: {
        required: [
          "Luxury Realism",
          "Garment Fidelity",
          "Editorial Fashion Quality",
          "Premium Composition",
        ],

        prohibited: [
          "Cheap Styling",
          "Fashion Artifacts",
          "Overprocessed Skin",
          "Distracting Background",
          "Artificial Fashion Poses",
        ],
      },
    };
  },
};