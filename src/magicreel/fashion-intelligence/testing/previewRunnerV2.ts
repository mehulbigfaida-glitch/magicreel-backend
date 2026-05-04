import {
  composeCinematicPromptV2,
} from "../orchestration/cinematicComposerV2";

const result =
  composeCinematicPromptV2("lehenga");

console.log(
  JSON.stringify(result, null, 2)
);