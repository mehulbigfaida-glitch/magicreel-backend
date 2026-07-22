import { Request, Response } from "express";
import axios from "axios";
import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";
import os from "os";

import { prisma } from "../../../magicreel/db/prisma";
import { finalizeBilling } from "../../../billing/billing.middleware";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import { supabase } from "../../../lib/supabase";

fal.config({
  credentials: process.env.FAL_KEY!,
});

const { randomUUID } = require("crypto");

async function downloadImage(
  url: string,
  filename: string
) {

  const tempDir = os.tmpdir();

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, filename);

  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  fs.writeFileSync(filePath, response.data);

  return filePath;
}

export async function generateLookbookV1(
req:Request,
res:Response
){

try{

const {

heroImageUrl,

backHeroImageUrl,

lookbookStyle,

gender,

category,

}=req.body;

if(!heroImageUrl){

return res.status(400).json({

error:
"heroImageUrl required"

});

}

const userId=
(req as any).user?.id;

if(!userId){

return res.status(401).json({

error:"Unauthorized"

});

}

/* -------------------------
   LOOKBOOK ROW
-------------------------- */

const lookbook=
await prisma.lookbook.create({

data:{

user:{
connect:{
id:userId
}
},

garment:{
connect:{
id:"garment-default-1"
}
},

modelId:"default",

presetId:
lookbookStyle ||

"default",

status:"completed"

}

});

/* -------------------------
   BILLING OBJECT
-------------------------- */

(req as any).billing={

userId,

feature:"LOOKBOOK_ECOM",

creditsRequired:2,

predictionId:
lookbook.id

};

const poses:any[]=[];

/* -------------------------
   HERO
-------------------------- */

poses.push({

poseId:"hero",

imageUrl:
heroImageUrl

});

await prisma.render.create({

data:{

pose:"hero",

engine:"QWEN",

type:"LOOKBOOK",

status:"completed",

modelImageUrl:
heroImageUrl,

garmentImageUrl:
heroImageUrl,

outputImageUrl:
heroImageUrl,

lookbookId:
lookbook.id

}

});

/* -------------------------
   BACK HERO
-------------------------- */

if(backHeroImageUrl){

poses.push({

poseId:"back",

imageUrl:
backHeroImageUrl

});

await prisma.render.create({

data:{

pose:"back",

engine:"QWEN",

type:"LOOKBOOK",

status:"completed",

modelImageUrl:
backHeroImageUrl,

garmentImageUrl:
backHeroImageUrl,

outputImageUrl:
backHeroImageUrl,

lookbookId:
lookbook.id

}

});

}

/* -------------------------
   GPT IMAGE 2.0 LOOKBOOK V3
-------------------------- */

const UNIVERSAL_EDITORIAL_PROMPT = `
A professional high-resolution luxury fashion lookbook studio photograph.

The subject is the single model from the source image wearing the exact same garment, accessories, hairstyle and makeup.

Preserve the garment design, fabric, colour, drape, silhouette, fit and all garment details exactly.

Preserve the model identity exactly.

The background must remain a clean minimalist luxury fashion studio.

Choose a natural premium editorial fashion pose that best showcases this specific garment category.

The pose should maximise the visibility, elegance and presentation of the garment while remaining realistic and suitable for a professional luxury fashion campaign.

If the garment is flowing, draped or layered, choose a pose that naturally enhances the movement and structure of the garment.

If the garment is structured or tailored, choose a pose that highlights the silhouette and craftsmanship.

Every generated image should represent a distinctly different premium editorial fashion pose and composition.

Do not repeat the Hero pose.

Do not generate duplicate poses.

Allow the pose selection to be driven by the garment itself while maintaining premium luxury fashion photography standards.

The output must be one single full-body image.

Absolutely no grids, no collage panels, no splits, and only one person in frame.
`;

console.log("🎨 Generating Lookbook V3...");

const result = await fal.subscribe(
  "openai/gpt-image-2/edit",
  {
    input: {
      prompt: UNIVERSAL_EDITORIAL_PROMPT,
      image_urls: [heroImageUrl],
      num_images: 4, // four independent output images
      quality: "medium",
      output_format: "png",
    },
    logs: true,
  }
);

const generatedImages =
  result?.data?.images ?? [];

if (!generatedImages.length) {
  throw new Error("GPT Image 2.0 returned no images.");
}

console.log(`✅ GPT returned ${generatedImages.length} editorial images`);

/* -------------------------
   CLOUDINARY + RENDER RECORDS
-------------------------- */

for (let i = 0; i < generatedImages.length; i++) {

  const image = generatedImages[i];

  let finalUrl: string | null = null;

  try {

    const outputUrl = image?.url;

    if (!outputUrl) {
      console.warn(`⚠️ Editorial image ${i + 1} missing URL`);
      continue;
    }

    const localPath = await downloadImage(
      outputUrl,
      `editorial_${i + 1}.png`
    );

    const uploaded = await uploadToCloudinary(
      localPath,
      {
        folder: "magicreel/lookbooks",
        public_id: `${lookbook.id}_editorial_${i + 1}`,
      }
    );

    finalUrl = uploaded.secure_url;

    poses.push({
      poseId: `editorial_${i + 1}`,
      imageUrl: finalUrl,
    });

    await prisma.render.create({

      data: {

        pose: `editorial_${i + 1}`,

        engine: "GPT_IMAGE_2_MEDIUM",

        type: "LOOKBOOK",

        status: "completed",

        modelImageUrl: heroImageUrl,

        garmentImageUrl: heroImageUrl,

        outputImageUrl: finalUrl,

        lookbookId: lookbook.id,

      },

    });

    console.log(`✅ Editorial ${i + 1} uploaded`);

  } catch (err) {

    console.error(
      `❌ Editorial ${i + 1} failed`,
      err
    );

  }

}

console.log("✅ LOOKBOOK V3 COMPLETE");

/* -------------------------
   SHARE ASSET
-------------------------- */

const shareId=
randomUUID();

await supabase
.from("share_assets")
.insert([{

id:shareId,

type:"lookbook",

media:
poses.map(
(p,index)=>({

kind:"image",

url:p.imageUrl,

pose:index

})
),

metadata:{

poses:
poses.map((_,i)=>i),

aspectRatio:
"2:3"

}

}]);

console.log("✅ SHARE ASSET INSERTED");

/* -------------------------
   FINAL BILLING
-------------------------- */
console.log("✅ STARTING BILLING");

await finalizeBilling(
req
);

console.log("✅ BILLING COMPLETE");

console.log({

style:
lookbookStyle,

poses:
poses.length

});

console.log("✅ RETURNING SUCCESS RESPONSE");

return res.json({

success:true,

runId:
lookbook.id,

poses,

shareId

});

} catch (error: any) {

  console.error("❌ Lookbook generation failed");
  console.error(error);

  return res.status(500).json({
    error: "Lookbook failed",
  });

}

}