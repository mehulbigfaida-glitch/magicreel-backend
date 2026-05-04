import {
  composeCinematicPromptV4,
} from "../orchestration/cinematicComposerV4";

const result =
  composeCinematicPromptV4("lehenga");

console.log(
  JSON.stringify(result, null, 2)
);