"use strict";
// backend/src/magicreel/prompts/heroPrompt.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHeroPrompt = buildHeroPrompt;
const promptRegistryV1_1 = require("./promptRegistryV1");
const promptBuilder_1 = require("./promptBuilder");
function resolveRegistryKey(categoryKey, avatarGender) {
    if (promptRegistryV1_1.PROMPT_REGISTRY_V1[categoryKey]) {
        return categoryKey;
    }
    const isBack = categoryKey.endsWith("_BACK");
    const baseKey = isBack
        ? categoryKey.replace("_BACK", "")
        : categoryKey;
    let registryKey = null;
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
        if (promptRegistryV1_1.PROMPT_REGISTRY_V1[backKey]) {
            return backKey;
        }
        return registryKey;
    }
    return registryKey;
}
function buildHeroPrompt(input) {
    const { categoryKey, avatarGender } = input;
    let styling = input.styling;
    if (styling) {
        styling = styling.trim().toLowerCase();
    }
    const registryKey = resolveRegistryKey(categoryKey, avatarGender);
    return (0, promptBuilder_1.buildP2MPrompt)({
        category: registryKey,
        styling
    });
}
