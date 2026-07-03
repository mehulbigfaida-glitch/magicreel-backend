import { FashionCategory } from "../types/fashion.types";

export interface CampaignCategoryResult {
  category: FashionCategory;
  confidence: number;
  source:
    | "metadata"
    | "classifier";
}