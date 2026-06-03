import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

import { prisma } from "../../../magicreel/db/prisma";
import { finalizeBilling } from "../../../billing/billing.middleware";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import { supabase } from "../../../lib/supabase";

import {
FEMALE_POSES,
MALE_POSES
} from "./poseRegistry";
import { LOCKED_LOOKBOOK_PROMPT } from "./promptRegistry";

const { randomUUID } = require("crypto");

const REPLICATE_API_TOKEN =
process.env.REPLICATE_API_TOKEN as string;

const QWEN_URL =
"https://api.replicate.com/v1/models/qwen/qwen-image-edit-plus/predictions";


async function downloadImage(
url:string,
filename:string
){

const filePath=
path.join("/tmp",filename);

const response=
await axios.get(
url,
{
responseType:"arraybuffer"
}
);

fs.writeFileSync(
filePath,
response.data
);

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

category

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
   POSE ROUTING
-------------------------- */

const poseSet =

gender === "Men"

? MALE_POSES

: FEMALE_POSES;

for(
const pose
of poseSet
){

let finalUrl:string|null=null;

try{

console.log(
"Generating:",
pose.id
);


const response=
await axios.post(

QWEN_URL,

{

input:{

image:[
pose.url,
heroImageUrl
],

prompt:
LOCKED_LOOKBOOK_PROMPT,

aspect_ratio:
"match_input_image",

output_format:
"png"

}

},

{

headers:{

Authorization:
`Bearer ${REPLICATE_API_TOKEN}`

}

}

);


const predictionUrl=
response.data.urls.get;


let outputUrl=null;


for(
let i=0;
i<60;
i++
){

const poll=
await axios.get(

predictionUrl,

{

headers:{

Authorization:
`Bearer ${REPLICATE_API_TOKEN}`

}

}

);


if(
poll.data.status==="succeeded"
){

outputUrl=
poll.data.output[0];

break;

}


if(
poll.data.status==="failed"
){

break;

}


await new Promise(
r=>setTimeout(
r,
1500
)
);

}


if(outputUrl){

const localPath=
await downloadImage(

outputUrl,

`${pose.id}.png`

);


const uploaded=
await uploadToCloudinary(

  localPath,

  {

    folder:
    "magicreel/lookbooks",

    public_id:
    `${lookbook.id}_${pose.id}`

  }

);


finalUrl=
uploaded.secure_url;

}

}catch(err){

console.error(

"Pose failed:",

pose.id

);

}


poses.push({

poseId:
pose.id,

imageUrl:
finalUrl || ""

});


await prisma.render.create({

data:{

pose:
pose.id,

engine:
"QWEN",

type:
"LOOKBOOK",

status:
"completed",

modelImageUrl:
heroImageUrl,

garmentImageUrl:
heroImageUrl,

outputImageUrl:
finalUrl,

lookbookId:
lookbook.id

}

});

}


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


/* -------------------------
   FINAL BILLING
-------------------------- */

await finalizeBilling(
req
);

console.log({

style:
lookbookStyle,

poses:
poses.length

});


return res.json({

success:true,

runId:
lookbook.id,

poses,

shareId

});

}catch(error){

console.error(error);

return res.status(500).json({

error:
"Lookbook failed"

});

}

}