import { CreativeDecision } from "./creativeDecision.types";

export function parseCreativeDecision(
  response: string
): CreativeDecision {

  try {

    const cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const parsed =
      JSON.parse(cleaned);

    return parsed as CreativeDecision;

  } catch (err) {

    throw new Error(
      "Failed to parse Creative Decision JSON."
    );

  }

}