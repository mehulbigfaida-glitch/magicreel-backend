import "dotenv/config";
import OpenAI, { toFile } from "openai";
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

  // =====================
  // GARMENT INTELLIGENCE
  // =====================

  category?:string;

  garmentName?:string;

  fit?:string;

  tuckState?:string;

}){

    const prompt =
      buildCreateAIPrompt(
        input.category ?? "",
        input.garmentName ?? ""
      );

    console.log(
      "[CREATE AI GENERATING]"
    );

    console.log({

      garment:
        input.garmentImageUrl,

      muse:
        input.processingImageUrl,

      category:
        input.category,

      garmentName:
        input.garmentName

    });


const garmentResponse =
await fetch(
  input.garmentImageUrl
);

const garmentType =
garmentResponse.headers.get(
  "content-type"
) || "image/png";


const garmentBuffer =
Buffer.from(
  await garmentResponse.arrayBuffer()
);


const garmentFile =
await toFile(
  garmentBuffer,
  `garment.${garmentType.split("/")[1]}`,
  {
    type: garmentType
  }
);


const museResponse =
await fetch(
  input.processingImageUrl
);


const museType =
museResponse.headers.get(
  "content-type"
) || "image/png";


const museBuffer =
Buffer.from(
  await museResponse.arrayBuffer()
);


const museFile =
await toFile(
  museBuffer,
  `muse.${museType.split("/")[1]}`,
  {
    type: museType
  }
);


const result =
await client.images.edit({

  model:
    "gpt-image-2",

  image:[
    garmentFile,
    museFile
  ],

  prompt:`

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

`,

quality:"high",

size:"1024x1280"

});

console.log(
"[OPENAI RAW]",
JSON.stringify(
result,
null,
2
)
);

const imageBase64 =
result.data?.[0]?.b64_json;


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