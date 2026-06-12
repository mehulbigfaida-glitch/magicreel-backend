// backend/src/magicreel/prompts/promptRegistryV1.ts

export const PROMPT_REGISTRY_V1: Record<string, string> = {

  /* =========================
     SHARED BLOCKS
  ========================= */

  // 🔥 LOCKED BACKGROUND (DO NOT MODIFY)
  BG:
    "clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views",

  // 🔥 GARMENT LOCK (DO NOT MODIFY)
  LOCK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way.",

  /* =========================
     MEN
  ========================= */

  MEN_TSHIRT:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a male fashion model wearing the provided t-shirt garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral casual trousers and appropriate casual footwear.",

  MEN_TSHIRT_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a male fashion model wearing the provided t-shirt garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral casual trousers and appropriate casual footwear.",
  
  MEN_SHIRT:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a male fashion model wearing the provided shirt garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with charcoal grey tailored trousers and appropriate footwear.",

  MEN_SHIRT_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a male fashion model wearing the provided shirt garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with charcoal grey tailored trousers and appropriate footwear.",

  MEN_KURTA:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a male fashion model wearing the provided kurta garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with traditional trousers and appropriate ethnic footwear.",

  MEN_KURTA_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a male fashion model wearing the provided kurta garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with traditional trousers and appropriate ethnic footwear.",

  MEN_KURTA_SET:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a male fashion model wearing the provided kurta set garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate ethnic footwear.",

  MEN_KURTA_SET_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a male fashion model wearing the provided kurta set garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate ethnic footwear.",
  
  MEN_SHERWANI:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a male fashion model wearing the provided sherwani garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with traditional trousers and appropriate ethnic footwear.",

  MEN_SHERWANI_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a male fashion model wearing the provided sherwani garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with traditional trousers and appropriate ethnic footwear.",
  
  MEN_OVERLAY:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a male fashion model wearing the provided overlay garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral trousers and appropriate footwear.",

  MEN_OVERLAY_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a male fashion model wearing the provided overlay garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral trousers and appropriate footwear.",
  
  MEN_BOTTOM:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a male fashion model wearing the provided bottom garment paired with a neutral fitted t-shirt in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate casual footwear.",

  MEN_BOTTOM_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a male fashion model wearing the provided bottom garment paired with a neutral fitted t-shirt in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate casual footwear.",

  /* =========================
     WOMEN
  ========================= */

  WOMEN_TOP:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided top garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral trousers and appropriate footwear.",

  WOMEN_TOP_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided top garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral trousers and appropriate footwear.",
  
  WOMEN_TSHIRT:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided t-shirt garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral casual trousers and appropriate footwear.",

  WOMEN_TSHIRT_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided t-shirt garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral casual trousers and appropriate footwear.",
  
  WOMEN_SHIRT_BLOUSE:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided shirt or blouse garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with tailored trousers and appropriate footwear.",

  WOMEN_SHIRT_BLOUSE_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided shirt or blouse garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with tailored trousers and appropriate footwear.",

  WOMEN_ONE_PIECE:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided one-piece garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",

  WOMEN_ONE_PIECE_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided one-piece garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",
  
  WOMEN_ETHNIC_SET:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided ethnic set garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",

  WOMEN_ETHNIC_SET_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided ethnic set garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",
  
  WOMEN_SAREE:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided saree garment draped traditionally with structured waist pleats and the pallu flowing naturally over the shoulder in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",

  WOMEN_SAREE_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided saree garment draped traditionally with structured waist pleats and the pallu flowing naturally over the shoulder in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",
  
  WOMEN_LEHENGA:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided lehenga garment with a structured waistband and natural skirt flare in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",

  WOMEN_LEHENGA_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided lehenga garment with a structured waistband and natural skirt flare in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",
  
  WOMEN_OVERLAY:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided overlay garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral trousers and appropriate footwear.",

  WOMEN_OVERLAY_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided overlay garment in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with neutral trousers and appropriate footwear.",
  
  WOMEN_BOTTOM:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body studio fashion photograph of a female fashion model wearing the provided bottom garment paired with a neutral fitted top in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear.",

  WOMEN_BOTTOM_BACK:
    "The garment image provided is the source of truth. The generated outfit must exactly replicate the garment from the input image. Do not redesign, reinterpret or modify the garment in any way. Full body back view studio fashion photograph of a female fashion model wearing the provided bottom garment paired with a neutral fitted top in a clean studio environment with a soft light neutral grey gradient background, evenly lit from the front with diffused lighting, minimal shadows, consistent e-commerce fashion photography style, lighting remains consistent across all views, paired with appropriate footwear."

};