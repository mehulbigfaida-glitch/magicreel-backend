import { FashionCategory } from "../types/fashion.types";
import { FashionLanguage } from "./fashionLanguage.types";

export function resolveFashionLanguage(
  category: FashionCategory
): FashionLanguage {

  switch (category) {

    // =====================================================
    // ETHNIC LUXURY
    // =====================================================

    case "lehenga":
    case "saree":
    case "bridal":
    case "ethnicset":
      return "ethnic-luxury";

    // =====================================================
    // CONTEMPORARY FASHION
    // =====================================================

    case "westernwear":
    case "streetwear":
      return "contemporary-fashion";

    // =====================================================
    // OCCASION WEAR
    // =====================================================

    case "gown":
      return "occasion-wear";

    // =====================================================
    // ETHNIC MENSWEAR
    // =====================================================

    case "kurta":
      return "ethnic-menswear";

    // =====================================================
    // FORMAL MENSWEAR
    // =====================================================

    case "menswear":
      return "formal-menswear";

    // =====================================================
    // DEFAULT
    // =====================================================

    default:
      return "contemporary-fashion";
  }
}