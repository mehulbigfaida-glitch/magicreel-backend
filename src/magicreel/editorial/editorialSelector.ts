import { editorialWorldRegistry, EditorialWorld } from "./editorialWorldRegistry";

export type GarmentAnalysisInput = {
  category?: string;

  colorPalette?: string[];

  embroideryDensity?: "low" | "medium" | "high";

  silhouette?: string;

  mood?: string;

  western?: boolean;

  bridal?: boolean;

  jewelryHeavy?: boolean;
};

export type EditorialSelectionResult = {
  primaryWorld: EditorialWorld;

  secondaryWorlds: EditorialWorld[];
};

export function selectEditorialWorld(
  input: GarmentAnalysisInput
): EditorialSelectionResult {
  const category = input.category?.toLowerCase() || "";

  // BRIDAL / ROMANTIC
  if (
    input.bridal ||
    category.includes("lehenga") ||
    category.includes("bridal") ||
    category.includes("saree")
  ) {
    return {
      primaryWorld: findWorld("poetic-nature"),

      secondaryWorlds: [
        findWorld("heritage-romance"),
        findWorld("museum-couture"),
      ],
    };
  }

  // BLACK / DARK COUTURE
  if (
    category.includes("gown") &&
    hasDarkPalette(input.colorPalette)
  ) {
    return {
      primaryWorld: findWorld("dark-aristocracy"),

      secondaryWorlds: [
        findWorld("urban-luxury-cinema"),
        findWorld("noir-couture"),
      ],
    };
  }

  // STRUCTURED WESTERN FASHION
  if (
    category.includes("blazer") ||
    category.includes("structured") ||
    category.includes("western")
  ) {
    return {
      primaryWorld: findWorld("modern-minimal-luxury"),

      secondaryWorlds: [
        findWorld("museum-couture"),
      ],
    };
  }

  // EVENING / PARTYWEAR
  if (
    category.includes("cocktail") ||
    category.includes("party") ||
    category.includes("evening")
  ) {
    return {
      primaryWorld: findWorld("urban-luxury-cinema"),

      secondaryWorlds: [
        findWorld("dark-aristocracy"),
      ],
    };
  }

  // DEFAULT
  return {
    primaryWorld: findWorld("museum-couture"),

    secondaryWorlds: [
      findWorld("modern-minimal-luxury"),
    ],
  };
}

function findWorld(id: string): EditorialWorld {
  const world = editorialWorldRegistry.find((w) => w.id === id);

  if (!world) {
    throw new Error(`Editorial world not found: ${id}`);
  }

  return world;
}

function hasDarkPalette(palette?: string[]) {
  if (!palette) return false;

  const darkColors = [
    "black",
    "charcoal",
    "midnight",
    "deep navy",
    "graphite",
  ];

  return palette.some((color) =>
    darkColors.includes(color.toLowerCase())
  );
}