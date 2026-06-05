export const QWEN_2511_SAREE_CONFIG = {

  model:
  "qwen/qwen-image-edit-2511",

  aspect_ratio:
  "match_input_image",

  go_fast:
  true,

  lora_scale:
  1,

  lora_weights:
  "",

  output_format:
  "png",

  output_quality:
  95

};

export const SAREE_2511_SHOTS = [

  {
    id:"SA_01",
    name:"HIGH_ANGLE",
    prompt:
    `A full body front-high-angle shot of the fashion model looking up at the camera, keeping garment construction completely and facial identity consistent.`
  },

  {
    id:"SA_02",
    name:"LOW_ANGLE",
    prompt:
    `A ground-level camera perspective shooting up at the fashion model, eye-level lowered to knee-height. Dramatic upward camera tilt, maintain exact garment details, studio background and facial identity.`
  },

  {
    id:"SA_03",
    name:"THREE_QUARTER",
    prompt:
    `front-right quarter view eye-level shot, wide shot, full-length professional studio photo of the fashion model. The camera is rotated exactly 45 degrees right to the subject. Capturing a perfect three-quarter turned pose, maintaining identical clothing, fabric texture, garment construction, and facial identity.`
  },

  {
    id:"SA_04",
    name:"SIDE_PROFILE",
    prompt:
    `front-right quarter view eye-level shot, wide shot, full-length professional studio photo of the fashion model. The camera is rotated to the right side of the room, focusing cleanly on the model's right shoulder and right profile. Invert the composition layout entirely to the left. Maintaining identical clothing, fabric texture, garment construction, and facial identity.`
  },

  {
    id:"SA_05",
    name:"HAND_ON_WAIST",
    prompt:
    `front-right quarter view eye-level shot, wide shot, full body professional studio fashion catalog photo of the fashion model standing in a confident, static asymmetrical pose. The model's body is turned at a perfect three-quarter angle with both shoulders clearly visible. One hand is placed elegantly on her waist with fingers resting naturally against the hip, while the other arm relaxes naturally at her side. Her weight is slightly shifted to one leg, creating a striking, structured fashion silhouette with zero walking motion. Seamlessly replicate and carry over the exact same footwear visible in the source image input onto both feet; however, if the footwear is hidden, cropped, or not visible in the source image, default to generating a brand new pair of matching elegant luxury high-heel shoes to complete the outfit. Do not under any circumstances render bare feet. On a clean, seamless professional studio backdrop. Maintaining absolute facial identity, hair structure, and exact clothing fabric textures.`
  },

  {
    id:"SA_06",
    name:"EDITORIAL_SPIN",
    prompt:
    `front-right quarter view eye-level shot, wide shot, full body high-fashion editorial studio photo of the fashion model captured in a dynamic mid-pivot stance. The model's body is turned at an elegant three-quarter angle, executing a sharp cinematic spin that creates fluid motion, dramatic draping, and realistic folds in the clothing fabric. Both shoulders remain structural and clearly visible. Seamlessly replicate and carry over the exact same footwear visible in the source image input onto both feet; however, if the footwear is hidden, cropped, or not visible in the source image, default to generating a brand new pair of matching elegant luxury high-heel shoes to complete the outfit. Do not under any circumstances render bare feet. Standing on a clean, seamless professional studio backdrop with soft dramatic key lighting. Maintaining absolute facial identity, hair structure, and exact clothing fabric textures.`
  }

];