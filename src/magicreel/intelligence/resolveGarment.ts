import { CATEGORY_REGISTRY }
from "./categoryRegistry";

export function resolveGarment(

category:string,

garmentName:string

){

const lowerName=
garmentName
.toLowerCase();

let resolvedCategory=
category;

if(
!resolvedCategory
){

for(
const [key,items]
of Object.entries(
CATEGORY_REGISTRY
)){

const found=
items.find(
item=>
lowerName.includes(
item
)
);

if(found){

resolvedCategory=
key;

break;

}

}

}

console.log(

"[GARMENT DNA]",

{

inputCategory:
category,

garmentName,

resolvedCategory

}

);

return{

category:
resolvedCategory,

garmentName,

isTop:
resolvedCategory==="TOP",

isBottom:
resolvedCategory==="BOTTOM",

isOnePiece:
resolvedCategory==="ONE_PIECE",

isOverlay:
resolvedCategory==="OVERLAY",

isEthnic:
resolvedCategory==="ETHNIC",

isSet:
resolvedCategory==="SET"

};

}