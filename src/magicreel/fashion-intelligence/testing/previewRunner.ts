import {
  previewLuxuryPrompt,
} from "./previewPrompt";

const preview =
  previewLuxuryPrompt("lehenga");

console.log(
  JSON.stringify(preview, null, 2)
);