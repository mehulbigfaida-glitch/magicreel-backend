import { FashionLanguage } from "../directors/fashionLanguage.types";

import { LEHENGA_DIRECTOR } from "../directors/lehengaDirector";
import { SAREE_DIRECTOR } from "../directors/sareeDirector";
import { WESTERNWEAR_DIRECTOR } from "../directors/westernwearDirector";
import { MENSWEAR_DIRECTOR } from "../directors/menswearDirector";

import { DirectorOutput } from "../directors/baseDirector.types";

export function resolveProfile(
  language: FashionLanguage
): DirectorOutput {

  switch (language) {

    case "ethnic-luxury":
      return LEHENGA_DIRECTOR;

    case "contemporary-fashion":
      return WESTERNWEAR_DIRECTOR;

    case "occasion-wear":
      return WESTERNWEAR_DIRECTOR;

    case "ethnic-menswear":
      return MENSWEAR_DIRECTOR;

    case "formal-menswear":
      return MENSWEAR_DIRECTOR;

    case "layering":
      return WESTERNWEAR_DIRECTOR;

    default:
      return WESTERNWEAR_DIRECTOR;
  }
}