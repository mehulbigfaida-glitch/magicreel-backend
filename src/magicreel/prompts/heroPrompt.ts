// backend/src/magicreel/prompts/heroPrompt.ts

import { PROMPT_REGISTRY_V1 } from "./promptRegistryV1";
import { buildP2MPrompt } from "./promptBuilder";

type AvatarGender = "male" | "female";

function resolveRegistryKey(
  categoryKey: string,
  avatarGender: AvatarGender
): string {

  if (PROMPT_REGISTRY_V1[categoryKey]) {
    return categoryKey;
  }

  const isBack = categoryKey.endsWith("_BACK");

  const baseKey = isBack
    ? categoryKey.replace("_BACK", "")
    : categoryKey;

  let registryKey: string | null = null;

  if (avatarGender === "female") {

    switch (baseKey) {

      case "top":
        registryKey = "WOMEN_TOP";
        break;

      case "tshirt":
        registryKey = "WOMEN_TSHIRT";
        break;

      case "shirt":
        registryKey = "WOMEN_SHIRT_BLOUSE";
        break;

      case "one_piece":
        registryKey = "WOMEN_ONE_PIECE";
        break;

      case "ethnic_set":
        registryKey = "WOMEN_ETHNIC_SET";
        break;

      case "saree":
        registryKey = "WOMEN_SAREE";
        break;

      case "lehenga":
        registryKey = "WOMEN_LEHENGA";
        break;

      case "overlay":
        registryKey = "WOMEN_OVERLAY";
        break;

    }

  }

  if (avatarGender === "male") {

    switch (baseKey) {

      case "tshirt":
        registryKey = "MEN_TSHIRT";
        break;

      case "shirt":
        registryKey = "MEN_SHIRT";
        break;

      case "kurta":
        registryKey = "MEN_KURTA";
        break;

      case "kurta_set":
        registryKey = "MEN_KURTA_SET";
        break;

      case "sherwani":
        registryKey = "MEN_SHERWANI";
        break;

      case "overlay":
        registryKey = "MEN_OVERLAY";
        break;

    }

  }

  if (!registryKey) {
    throw new Error(`Hero prompt not found for ${categoryKey}`);
  }

  if (isBack) {

    const backKey = `${registryKey}_BACK`;

    if (PROMPT_REGISTRY_V1[backKey]) {
      return backKey;
    }

    return registryKey;
  }

  return registryKey;
}

export function buildHeroPrompt(
  input: {
    categoryKey: string;
    avatarGender: AvatarGender;
    styling?: string;
  }
): string {

  const { categoryKey, avatarGender } = input;

  let styling = input.styling;

  if (styling) {
    styling = styling.trim().toLowerCase();
  }

  const registryKey = resolveRegistryKey(
    categoryKey,
    avatarGender
  );

  return buildP2MPrompt({
    category: registryKey,
    styling
  });

}