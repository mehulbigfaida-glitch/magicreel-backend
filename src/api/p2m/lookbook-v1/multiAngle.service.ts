import "dotenv/config";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface MultiAngleInput {

  imageUrl:string;

  rotate_degrees?:number;

  vertical_tilt?:number;

  move_forward?:number;

  prompt?:string;

}

export async function generateMultiAngleShot(
  input: MultiAngleInput
){

  const output =
  await replicate.run(

    "qwen/qwen-edit-multiangle",

    {

      input: {

        image:
        input.imageUrl,

        prompt:
        input.prompt || "",

        seed:42,

        go_fast:false,

        lora_scale:1.25,

        aspect_ratio:
        "match_input_image",

        lora_weights:
        "dx8152/Qwen-Edit-2509-Multiple-angles",

        move_forward:
        input.move_forward || 0,

        output_format:
        "png",

        vertical_tilt:
        input.vertical_tilt || 0,

        output_quality:
        95,

        rotate_degrees:
        input.rotate_degrees || 0,

        use_wide_angle:
        false,

        true_guidance_scale:
        1

      }

    }

  );

  const finalImageUrl =

Array.isArray(output)

? String(output[0])

: String(output);

  return {

    imageUrl:
finalImageUrl,

    engine:
    "MULTI_ANGLE",

    source:
    "replicate",

    model:
    "qwen/qwen-edit-multiangle"

  };

}