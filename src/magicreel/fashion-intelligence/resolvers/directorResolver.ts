import { FashionCategory } from "../types/fashion.types";

import { LEHENGA_DIRECTOR } from "../directors/lehengaDirector";
import { SAREE_DIRECTOR } from "../directors/sareeDirector";
import { MENSWEAR_DIRECTOR } from "../directors/menswearDirector";
import { WESTERNWEAR_DIRECTOR } from "../directors/westernwearDirector";

import { DirectorOutput } from "../directors/baseDirector.types";

export function resolveDirector(
  category: FashionCategory
): DirectorOutput {
  switch (category) {
    case "lehenga":
    case "bridal":
      return LEHENGA_DIRECTOR;

    case "saree":
      return SAREE_DIRECTOR;

    case "menswear":
    case "kurta":
      return MENSWEAR_DIRECTOR;

    case "westernwear":
    case "streetwear":
    case "gown":
      return WESTERNWEAR_DIRECTOR;

    case "ethnicset":
      return SAREE_DIRECTOR;

    default:
      return WESTERNWEAR_DIRECTOR;
  }
}