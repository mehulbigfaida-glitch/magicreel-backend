import { GarmentDNA }
from "./types";

export function buildPromptRules(
g:GarmentDNA
){

if(
g.isTop
){

return`

- generate realistic lower garments
- preserve shirt hem behavior
- generate premium footwear
- avoid underwear-like bottoms

`;

}

if(
g.isBottom
){

return`

- generate complementary top
- generate premium footwear

`;

}

if(
g.isOnePiece
){

return`

- preserve silhouette
- preserve hem behavior
- preserve draping

`;

}

if(
g.isOverlay
){

return`

- generate complementary inner garment
- generate lower garments

`;

}

if(
g.isEthnic
){

return`

- preserve draping
- preserve blouse structure
- preserve neckline
- do not invent garments

`;

}

if(
g.isSet
){

return`

- preserve complete coordinated outfit
- do not split garments

`;

}

return "";

}