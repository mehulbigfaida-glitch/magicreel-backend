export type FashionGender =
  | "female"
  | "male";

export type FashionHeroView =
  | "front"
  | "back";

export interface FashionPromptRule {
  description: string;

  garmentRules: string[];

  frontRules?: string[];

  backRules?: string[];

  displayRules?: string[];

  footwearRules?: string[];

  jewelleryRules?: string[];

  negativeRules?: string[];
}

export interface FashionCategoryRegistry {
  gender: FashionGender;

  category: string;

  rule: FashionPromptRule;
}

/* ==========================================================
   WOMEN — FASHION PROMPT REGISTRY
========================================================== */

export const WOMEN_FASHION_PROMPT_REGISTRY:
  Record<string, FashionCategoryRegistry> = {

  /* ========================================================
     TOP
  ======================================================== */

  top: {
    gender: "female",
    category: "top",

    rule: {
      description:
        "Women's upper-body fashion top.",

      garmentRules: [
        "Preserve the uploaded top exactly as shown.",
        "The top is the primary commercial product.",
        "Complete the outfit with an understated full-length bottom garment.",
      ],

      displayRules: [
        "Keep the complete top clearly visible.",
        "Preserve neckline, sleeves, hemline and construction.",
      ],

      footwearRules: [
        "Use refined premium fashion footwear.",
      ],

      negativeRules: [
        "Do not redesign the top.",
        "Do not introduce distracting prints or embellishments into the bottom garment.",
        "Do not use shorts or cropped bottoms.",
      ],
    },
  },

  /* ========================================================
     T-SHIRT
  ======================================================== */

  tshirt: {
    gender: "female",
    category: "tshirt",

    rule: {
      description:
        "Women's T-shirt.",

      garmentRules: [
        "Preserve the uploaded T-shirt exactly as shown.",
        "The T-shirt is the primary commercial product.",
        "Complete the outfit with an understated full-length bottom garment.",
      ],

      displayRules: [
        "Preserve the original T-shirt silhouette, neckline, sleeves, print and branding.",
      ],

      negativeRules: [
        "Do not redesign or restyle the T-shirt.",
        "Do not introduce distracting graphics into the completed outfit.",
        "Do not use shorts or cropped bottoms.",
      ],
    },
  },

  /* ========================================================
     SHIRT / BLOUSE
  ======================================================== */

  shirt: {
    gender: "female",
    category: "shirt",

    rule: {
      description:
        "Women's shirt or blouse.",

      garmentRules: [
        "Preserve the uploaded shirt or blouse exactly as shown.",
        "Complete the outfit with an appropriate full-length bottom garment.",
      ],

      displayRules: [
        "Clearly show the collar, neckline, sleeves, cuffs, buttons and hemline.",
      ],

      negativeRules: [
        "Do not redesign the shirt or blouse.",
        "Do not introduce distracting styling elements.",
        "Do not use shorts or cropped bottoms.",
      ],
    },
  },

  /* ========================================================
     ONE-PIECE
  ======================================================== */

  one_piece: {
    gender: "female",
    category: "one_piece",

    rule: {
      description:
        "Women's one-piece dress or complete one-piece fashion garment.",

      garmentRules: [
        "Treat the uploaded garment as the complete outfit.",
        "Do not generate additional clothing.",
        "Preserve the complete one-piece silhouette exactly.",
      ],

      displayRules: [
        "Keep the entire garment visible from neckline to hem.",
        "Preserve the complete front and back construction.",
      ],

      footwearRules: [
        "Use elegant premium footwear appropriate to the dress.",
      ],

      negativeRules: [
        "Do not split the garment into separate top and bottom pieces.",
        "Do not add unnecessary layers.",
      ],
    },
  },

  /* ========================================================
     ETHNIC SET — LEGACY / GENERAL ETHNIC
  ======================================================== */

  ethnic_set: {
    gender: "female",
    category: "ethnic_set",

    rule: {
      description:
        "Women's coordinated ethnic fashion set.",

      garmentRules: [
        "Treat the uploaded garment as a complete coordinated ethnic outfit.",
        "Preserve every component exactly as shown.",
        "Preserve the relationship, layering and proportions between all components.",
      ],

      displayRules: [
        "Show the complete ethnic outfit clearly.",
        "Preserve embroidery, embellishments, trims, dupatta or other visible components.",
      ],

      footwearRules: [
        "Use elegant ethnic footwear appropriate to the outfit.",
        "Prefer refined mojari, jutti or elegant ethnic heels.",
        "For premium fashion presentation, do not use casual ethnic chappals.",
        "Footwear must remain visually subordinate to the garment.",
      ],

      negativeRules: [
        "Do not reinterpret the ethnic set as another garment category.",
        "Do not omit any component.",
        "Do not replace garment components.",
      ],
    },
  },

  /* ========================================================
     SAREE
  ======================================================== */

  saree: {
    gender: "female",
    category: "saree",

    rule: {
      description:
        "Women's saree.",

      garmentRules: [
        "Treat the uploaded saree as an immutable finished commercial product.",
        "Preserve saree fabric, border, embroidery, print, texture and colour exactly.",
        "Preserve the blouse as shown when included in the source garment.",
        "Preserve the relationship between saree and blouse.",
      ],

      frontRules: [
        "The saree pallu must be clearly visible in the front presentation.",
        "Display the pallu naturally and elegantly so its fabric, border, embroidery and design details are visible.",
        "Preserve the saree drape and pleating realistically.",
      ],

      backRules: [
        "Preserve the saree drape and pallu relationship from the back.",
        "Show the rear silhouette naturally without inventing garment construction.",
      ],

      displayRules: [
        "The saree must unmistakably read as a saree.",
        "Show the full saree silhouette from head to toe.",
        "Make important border, pallu and blouse details visible.",
      ],

      footwearRules: [
        "Use elegant ethnic heels or refined fashion heels.",
        "Do not use casual ethnic chappals.",
      ],

      negativeRules: [
        "Do not reinterpret the saree as a gown.",
        "Do not remove or hide the pallu.",
        "Do not invent a different blouse design.",
        "Do not alter the saree drape into a different garment structure.",
      ],
    },
  },

  /* ========================================================
     LEHENGA
  ======================================================== */

  lehenga: {
    gender: "female",
    category: "lehenga",

    rule: {
      description:
        "Women's lehenga set.",

      garmentRules: [
        "Treat the uploaded garment as a complete coordinated lehenga outfit.",
        "Preserve blouse, lehenga skirt, dupatta and all visible components exactly as shown.",
        "Preserve the relationship and layering between blouse, skirt and dupatta.",
      ],

      frontRules: [
        "Show the complete lehenga silhouette clearly.",
        "Keep blouse, skirt and dupatta visually distinguishable.",
        "Preserve embroidery, embellishment, borders and fabric texture.",
      ],

      backRules: [
        "Show the complete rear lehenga silhouette.",
        "Preserve the rear blouse construction, skirt volume and dupatta placement.",
      ],

      displayRules: [
        "The garment must unmistakably read as a lehenga.",
        "Show the complete outfit from head to toe.",
        "Preserve the natural volume and drape of the lehenga skirt.",
      ],

      footwearRules: [
        "Use elegant ethnic heels or premium fashion heels.",
        "Do not use casual ethnic chappals.",
      ],

      negativeRules: [
        "Do not reinterpret the lehenga as a gown.",
        "Do not remove the dupatta when it is part of the source garment.",
        "Do not merge or redesign the blouse and skirt.",
        "Do not change the lehenga silhouette.",
      ],
    },
  },

  /* ========================================================
     OVERLAY / JACKET
  ======================================================== */

  overlay: {
    gender: "female",
    category: "overlay",

    rule: {
      description:
        "Women's overlay, jacket or outer fashion layer.",

      garmentRules: [
        "Preserve the uploaded overlay or jacket exactly as shown.",
        "Complete the underlying outfit with understated complementary garments when necessary.",
        "The uploaded overlay remains the primary product.",
      ],

      displayRules: [
        "Clearly show the complete overlay silhouette.",
        "Preserve lapels, collar, sleeves, buttons, closures, trims and construction.",
      ],

      negativeRules: [
        "Do not redesign the overlay.",
        "Do not replace the overlay with another jacket style.",
        "Do not introduce unnecessary layers.",
      ],
    },
  },

  /* ========================================================
     BOTTOMS
  ======================================================== */

  bottoms: {
    gender: "female",
    category: "bottoms",

    rule: {
      description:
        "Women's lower-body garment.",

      garmentRules: [
        "Preserve the uploaded bottom garment exactly as shown.",
        "Complete the upper body with an understated neutral garment.",
      ],

      displayRules: [
        "Show the complete bottom silhouette.",
        "Preserve waistband, rise, pleats, seams, pockets, hemline and fabric behaviour.",
      ],

      footwearRules: [
        "Use refined footwear appropriate to the garment length and style.",
      ],

      negativeRules: [
        "Do not redesign the bottom garment.",
        "Do not introduce distracting patterns into the completed upper garment.",
      ],
    },
  },
};

/* ==========================================================
   MEN — RESERVED FOR NEXT PHASE
========================================================== */

export const MEN_FASHION_PROMPT_REGISTRY:
  Record<string, FashionCategoryRegistry> = {};

/* ==========================================================
   REGISTRY LOOKUP
========================================================== */

export function getFashionPromptRule(
  categoryKey: string,
  avatarGender: string
): FashionCategoryRegistry | null {

  const normalizedCategory =
    categoryKey
      .trim()
      .toLowerCase()
      .replace("_back", "");

  const normalizedGender =
    avatarGender
      .trim()
      .toLowerCase();

  if (
    normalizedGender === "female" ||
    normalizedGender === "women"
  ) {
    return (
      WOMEN_FASHION_PROMPT_REGISTRY[
        normalizedCategory
      ] || null
    );
  }

  if (
    normalizedGender === "male" ||
    normalizedGender === "men"
  ) {
    return (
      MEN_FASHION_PROMPT_REGISTRY[
        normalizedCategory
      ] || null
    );
  }

  return null;
}
