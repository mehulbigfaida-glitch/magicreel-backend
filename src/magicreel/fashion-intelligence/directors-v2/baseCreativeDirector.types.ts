import { CreativePlan } from "../planning/creativePlan.types";
import { PromptContext } from "../types/context.types";

export interface CreativeDirector {
  id: string;

  displayName: string;

  supportedCategories: string[];

  buildPlan(
    context: PromptContext
  ): Partial<CreativePlan>;
}