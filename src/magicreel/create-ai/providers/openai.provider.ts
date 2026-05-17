import "dotenv/config";
import OpenAI from "openai";
import { v2 as cloudinary } from "cloudinary";
import { buildCreateAIPrompt } from "../createAI.prompt";

const client = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY,
});

cloudinary.config({

  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET

});

export class OpenAIProvider {

  async generate(input:{
    garmentImageUrl:string;
    processingImageUrl:string;
  }){

    const prompt =
      buildCreateAIPrompt();

    console.log(
      "[CREATE AI GENERATING]"
    );

    console.log({

      garment:
        input.garmentImageUrl,

      muse:
        input.processingImageUrl

    });

    const result =
    await client.responses.create({

      model:
        "gpt-image-2",

      tools:[
        {
          type:
          "image_generation"
        }
      ],

      input:[{

        role:"user",

        content:[

          {

            type:
            "input_text",

            text:`

${prompt}

TASK:

Create one premium luxury fashion hero.

IMAGE 1:
GARMENT SOURCE OF TRUTH

IMAGE 2:
MUSE SOURCE OF TRUTH

PRIMARY OPERATION:

Transfer the exact garment from IMAGE 1 onto the person in IMAGE 2.

Do not redesign.
Do not reinterpret.
Do not restyle.

GARMENT RULES:

- preserve exact silhouette
- preserve exact embroidery
- preserve exact textile
- preserve exact stitching
- preserve exact colors
- preserve exact proportions
- preserve exact drape
- preserve exact garment length
- preserve exact fit
- preserve exact folds

MUSE RULES:

- preserve exact face identity
- preserve hairstyle
- preserve anatomy
- preserve skin tone
- preserve body proportions

COMPOSITION:

- exact 4:5 portrait
- exact 1024x1280 composition
- full body visible
- head to feet visible
- centered
- symmetrical

QUALITY:

- ultra premium
- luxury campaign quality
- DSLR realism
- realistic skin pores
- sharp face details
- high textile detail
- premium lighting

BACKGROUND:

- premium seamless studio
- soft shadows
- minimal luxury environment

NEGATIVE:

- no garment redesign
- no identity drift
- no cropped feet
- no AI artifacts
- no extra limbs
- no altered face

`
          },

          {

            type:
            "input_image",

            image_url:
            input.garmentImageUrl,

            detail:
            "high"

          },

          {

            type:
            "input_image",

            image_url:
            input.processingImageUrl,

            detail:
            "high"

          }

        ]

      }]

    });

    console.log(
      "[OPENAI RAW]",
      JSON.stringify(
        result,
        null,
        2
      )
    );

    const generated =
    result.output.find(

      (item:any)=>

      item.type===

      "image_generation_call"

    ) as any;

    if(
      !generated
    ){

      throw new Error(
        "No image generated"
      );

    }

    const imageBase64 =
      generated?.result;

    if(
      !imageBase64
    ){

      throw new Error(
        "Image payload missing"
      );

    }

    const uploadResult =
    await cloudinary
    .uploader
    .upload(

      `data:image/png;base64,${imageBase64}`,

      {

        folder:
        "magicreel/create-ai"

      }

    );

    console.log(

      "[CLOUDINARY HERO]",

      uploadResult.secure_url

    );

    return{

      success:true,

      engine:"openai",

      output:
      uploadResult.secure_url

    };

  }

}