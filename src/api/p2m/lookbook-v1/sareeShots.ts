export type SareeShot = {

id:string;

type:
"MULTI_ANGLE"
|
"SKELETON";

rotate_degrees?:number;

vertical_tilt?:number;

move_forward?:number;

prompt?:string;

poseUrl?:string;

};

export const SAREE_SHOTS:SareeShot[]=[

{
id:"SA_01",
type:"MULTI_ANGLE",
rotate_degrees:60
},

{
id:"SA_02",
type:"MULTI_ANGLE",
rotate_degrees:-60
},

{
id:"SA_03",
type:"MULTI_ANGLE",
vertical_tilt:-1,
move_forward:2
},

{
id:"SA_04",
type:"MULTI_ANGLE",
vertical_tilt:1
},

{
id:"SA_05",
type:"MULTI_ANGLE",

prompt:
"A tight, medium shot focused on the mid-torso of the model showing full face till waist. Exact same lighting and fabric details, zero-degree rotation, highlighting garment construction and texture details"
},

{
id:"FS_07",

type:"SKELETON",

poseUrl:
"https://res.cloudinary.com/duaqfspwa/image/upload/v1779763317/fo7_vjqznq.png"
}

];