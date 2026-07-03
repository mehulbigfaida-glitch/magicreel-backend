import { FashionCategory } from "../types/fashion.types";
import { CreativeDirector } from "../directors-v2/baseCreativeDirector.types";
import { EDITORIAL_CREATIVE_DIRECTOR } from "../directors-v2/editorialCreativeDirector";
import { LEHENGA_CREATIVE_DIRECTOR } from "../directors-v2/lehengaCreativeDirector";

const DIRECTORS = [
  LEHENGA_CREATIVE_DIRECTOR,
  EDITORIAL_CREATIVE_DIRECTOR,
];

export function resolveCreativeDirector(
  category: FashionCategory
): CreativeDirector {

  console.log("Requested Category:", category);

  console.log(
    "Available Directors:",
    DIRECTORS.map(d => ({
      name: d.displayName,
      categories: d.supportedCategories,
    }))
  );

  const director = DIRECTORS.find((d) =>
    d.supportedCategories.includes(category)
  );

  console.log(
    "Resolved Director:",
    director?.displayName
  );

  if (!director) {
    throw new Error(
      `No Creative Director registered for category '${category}'.`
    );
  }

  return director;
}