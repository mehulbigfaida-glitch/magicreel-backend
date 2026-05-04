import {
  composeCinematicPromptV5,
} from "../orchestration/cinematicComposerV5";

const result =
  composeCinematicPromptV5("lehenga");

console.log(
  JSON.stringify(result, null, 2)
);