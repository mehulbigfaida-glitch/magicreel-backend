export interface EditorialWorld {
  id: string;

  name: string;

  description: string;

  lighting: string;

  storytelling: string;
}

const WORLDS: EditorialWorld[] = [

  {
    id: "museum",

    name: "Museum Gallery",

    description:
      "A monumental museum gallery featuring soaring limestone walls, sculptural marble statues, polished stone flooring, dramatic symmetry, vast exhibition halls, refined negative space and breathtaking museum-scale architecture. The setting feels timeless, quiet and worthy of an international couture exhibition.",

    lighting:
      "Soft skylight illumination creating sculptural shadows, luxurious textile highlights and elegant museum-grade depth.",

    storytelling:
      "An international couture exhibition celebrating timeless craftsmanship.",
  },

  {
    id: "palace",

    name: "Royal Palace",

    description:
      "A magnificent royal sandstone palace corridor with towering carved arches, hand-crafted pillars, polished heritage stone floors, grand symmetry, deep architectural perspective and regal spatial scale. The environment radiates timeless royal luxury while remaining visually clean and editorial.",

    lighting:
      "Warm golden-hour sunlight streaming through monumental arches producing cinematic shadows and premium textile highlights.",

    storytelling:
      "A royal couture campaign celebrating heritage, craftsmanship and timeless elegance.",
  },

  {
    id: "villa",

    name: "Italian Villa",

    description:
      "A luxurious Italian villa with classical marble columns, expansive terraces, elegant courtyards, premium limestone flooring and refined European architecture. Every surface feels sophisticated, airy and quietly luxurious with beautiful long perspectives.",

    lighting:
      "Soft Mediterranean afternoon sunlight producing warm natural illumination and elegant fashion shadows.",

    storytelling:
      "A luxury editorial inspired by timeless European sophistication.",
  },

  {
    id: "gallery",

    name: "Contemporary Art Gallery",

    description:
      "A world-class contemporary art gallery with sculptural white architecture, expansive exhibition halls, premium polished flooring, minimalist geometry, museum-quality negative space and refined artistic atmosphere designed for luxury fashion editorials.",

    lighting:
      "Natural diffused gallery lighting with elegant soft shadows and premium texture rendering.",

    storytelling:
      "Luxury couture presented as wearable contemporary art.",
  },

  {
    id: "brutalist",

    name: "Brutalist Editorial Hall",

    description:
      "A dramatic architectural hall constructed from sculptural exposed concrete with monumental geometry, clean lines, enormous vertical scale, luxurious minimalist detailing and striking editorial symmetry creating a bold contemporary fashion environment.",

    lighting:
      "Directional architectural lighting producing dramatic contrast, premium sculptural shadows and exceptional depth.",

    storytelling:
      "A contemporary couture campaign where architecture becomes part of the fashion narrative.",
  },

  {
    id: "heritage",

    name: "Royal Heritage Haveli",

    description:
      "An authentic heritage haveli featuring intricately carved sandstone walls, royal courtyards, handcrafted jharokhas, majestic arches, polished heritage flooring and timeless Indian architectural craftsmanship. The environment feels elegant, culturally rich and internationally luxurious rather than traditional.",

    lighting:
      "Warm natural sunlight entering through heritage arches creating luxurious depth and cinematic ambience.",

    storytelling:
      "A couture editorial celebrating India's royal craftsmanship and heritage.",
  },

  {
    id: "opera",

    name: "Grand Opera House",

    description:
      "An opulent European opera house with sweeping staircases, soaring ceilings, marble columns, grand arches, elegant balconies and museum-grade architectural drama. Every angle communicates luxury, scale and couture sophistication.",

    lighting:
      "Soft theatrical lighting blended with warm ambient architectural illumination.",

    storytelling:
      "An editorial celebrating timeless couture in a grand cultural landmark.",
  },

  {
    id: "glass-atrium",

    name: "Luxury Glass Atrium",

    description:
      "A monumental contemporary glass atrium filled with natural daylight, premium stone flooring, clean architectural lines, expansive vertical spaces and elegant reflections creating a refined modern luxury environment.",

    lighting:
      "Bright diffused natural daylight with premium luxury reflections and soft fashion shadows.",

    storytelling:
      "A modern couture campaign celebrating architecture, light and elegance.",
  }

];

export function getRandomEditorialWorld(): EditorialWorld {

  return WORLDS[
    Math.floor(Math.random() * WORLDS.length)
  ];

}