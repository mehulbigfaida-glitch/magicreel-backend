import { AccessoryProfile } from "./accessoryProfile.types";

export const ACCESSORY_REGISTRY: Record<
  string,
  AccessoryProfile
> = {

  lehenga: {

    profileId: "lehenga",

    jewellery: [

      "Luxury Kundan bridal jewellery",

      "Elegant chandbali earrings",

      "Traditional bridal bangles",

      "Delicate statement ring",

      "Optional maang tikka only if suitable",

    ],

    footwear: [

      "Luxury embroidered heels",

    ],

    handAccessories: [

      "Elegant bridal bangles",

    ],

    hairStyling: [

      "Luxury bridal hairstyle",

      "Soft waves",

      "Elegant low bun",

    ],

    beauty: [

      "Premium bridal makeup",

      "Natural luxury skin finish",

    ],

    luxuryRules: [

      "Accessories must complement the garment.",

      "Embroidery must remain the hero.",

      "Luxury craftsmanship only.",

    ],

    prohibited: [

      "Cheap jewellery",

      "Plastic accessories",

      "Fantasy accessories",

      "Western street accessories",

    ],

  },

  saree: {

    profileId: "saree",

    jewellery: [

      "Temple jewellery",

      "Elegant earrings",

      "Luxury bangles",

    ],

    footwear: [

      "Traditional luxury sandals",

    ],

    handAccessories: [

      "Elegant bangles",

    ],

    hairStyling: [

      "Graceful traditional hairstyle",

    ],

    beauty: [

      "Soft premium makeup",

    ],

    luxuryRules: [

      "Jewellery should enhance elegance.",

    ],

    prohibited: [

      "Streetwear accessories",

    ],

  },

  default: {

    profileId: "default",

    jewellery: [],

    footwear: [],

    handAccessories: [],

    hairStyling: [],

    beauty: [],

    luxuryRules: [],

    prohibited: [],

  },

};