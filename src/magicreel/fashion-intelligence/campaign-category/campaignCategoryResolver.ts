import { FashionCategory } from "../types/fashion.types";

type ResolveArgs = {
  heroImageUrl: string;

  category?: FashionCategory;
};

export async function resolveCampaignCategory(
  args: ResolveArgs
): Promise<FashionCategory> {

  // 1. Category already known
  if (args.category) {
    return args.category;
  }

  // 2. TODO
  // Ask Fashion Classifier

  throw new Error(
    "Campaign category classifier not connected."
  );
}