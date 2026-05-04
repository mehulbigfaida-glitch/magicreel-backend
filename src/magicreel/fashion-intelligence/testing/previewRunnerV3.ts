import {
  composeCinematicPromptV3,
} from "../orchestration/cinematicComposerV3";

const result =
  composeCinematicPromptV3("lehenga");

console.log(
  JSON.stringify(result, null, 2)
);