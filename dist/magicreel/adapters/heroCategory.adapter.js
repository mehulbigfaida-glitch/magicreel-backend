"use strict";
// 🔒 Hero Category Adapter — Create-V2 Safe
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveHeroCategoryKey = resolveHeroCategoryKey;
function resolveHeroCategoryKey(input) {
    const { avatarGender, garmentType } = input;
    if (avatarGender === "female") {
        switch (garmentType) {
            case "top":
            case "tshirt":
                return "WOMEN_TOP_WESTERN";
            case "shirt":
                return "WOMEN_SHIRT_BLOUSE";
            case "one_piece":
                return "WOMEN_ONE_PIECE";
            case "ethnic_set":
                return "WOMEN_ETHNIC_SET";
            case "saree":
                return "WOMEN_SAREE";
            case "lehenga":
                return "WOMEN_LEHENGA";
        }
    }
    if (avatarGender === "male") {
        switch (garmentType) {
            case "shirt":
                return "MEN_SHIRT";
            case "tshirt":
                return "MEN_TSHIRT";
            case "kurta":
                return "MEN_KURTA";
            case "kurta_set":
                return "MEN_KURTA_SET";
            case "sherwani":
                return "MEN_SHERWANI";
        }
    }
    throw new Error(`Unsupported hero category: gender=${avatarGender}, garmentType=${garmentType}`);
}
