import { Request, Response } from "express";

import {
MALE_POSES,
FEMALE_POSES
} from "./poseRegistry";

import {
LOCKED_LOOKBOOK_PROMPT
} from "./promptRegistry";


export async function generateLookbookV1(
req:Request,
res:Response
){

try{

const {
heroImageUrl,
backHeroImageUrl,
lookbookStyle
}=req.body;


if(!heroImageUrl){

return res.status(400).json({

error:
"heroImageUrl required"

});

}
const poses = MALE_POSES;

console.log(
"LOOKBOOK V1:",
{
style:lookbookStyle,
poses:poses.length
}
);

return res.json({

success:true,

runId: Date.now().toString(),

message:
"Lookbook V1 initialized",

lookbookStyle,

prompt:
LOCKED_LOOKBOOK_PROMPT,

poses

});

}

catch(error){

console.error(error);

return res.status(500).json({

error:
"Lookbook failed"

});

}

}