import { Request, Response } from "express";

import { generateMultiAngleShot }
from "./multiAngle.service";

export async function testMultiAngle(
req:Request,
res:Response
){

try{

const {
heroImageUrl
}=req.body;

if(!heroImageUrl){

return res.status(400).json({
error:"heroImageUrl required"
});

}

const result =
await generateMultiAngleShot({

imageUrl:
heroImageUrl,

rotate_degrees:
60

});

return res.json(result);

}
catch(error){

console.error(error);

return res.status(500).json({

error:
"MultiAngle failed"

});

}

}