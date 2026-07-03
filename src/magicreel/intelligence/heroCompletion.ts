export function buildHeroCompletion(
  category:string
){

switch(
 category.toLowerCase()
){

case "shirt":

return`

- generate realistic full-length trousers or denim
- preserve untucked shirt presentation
- use premium fashion footwear
- avoid underwear-like lower garments
- avoid barefoot
- create complete fashion styling

`;

case "dress":

return`

- preserve dress draping
- preserve hem behavior
- generate complementary footwear only if naturally visible
- create complete premium styling

`;

case "saree":

return`

- preserve blouse structure
- preserve blouse neckline
- preserve blouse coverage
- preserve saree draping
- do not invent tube tops
- do not force feet visibility

`;

default:

return`
- create complete premium fashion styling
`;

}

}