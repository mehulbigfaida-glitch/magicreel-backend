import { GarmentDNA } from "./types";

export function buildPromptRules(
  dna: GarmentDNA
): string {

  const rules:string[]=[];

  // GLOBAL
  rules.push(
    "preserve original garment structure"
  );

  rules.push(
    "preserve intended garment styling"
  );

  rules.push(
    "do not invent garment components not present in source"
  );


  // FOOTWEAR

  if(
    dna.footVisibility==="visible"
  ){

    rules.push(
      "avoid barefoot appearance"
    );

  }


  // BLOUSE

  if(
    dna.blousePresent
  ){

    rules.push(
      "preserve original blouse structure"
    );

    rules.push(
      "preserve blouse neckline"
    );

    rules.push(
      "preserve blouse coverage"
    );

    rules.push(
      "never replace blouse with tube tops"
    );

  }


  // TUCK

  if(
    dna.tuckState==="tucked"
  ){

    rules.push(
      "maintain original tucked styling"
    );

  }

  if(
    dna.tuckState==="untucked"
  ){

    rules.push(
      "maintain original untucked styling"
    );

  }


  // FIT

  if(
    dna.fit==="oversized"
  ){

    rules.push(
      "preserve relaxed oversized silhouette"
    );

  }


  // LAYERING

  if(
    dna.layering==="multi"
  ){

    rules.push(
      "preserve garment layering"
    );

  }


  // CLOSURE

  if(
    dna.closureState==="open"
  ){

    rules.push(
      "maintain original open garment state"
    );

  }


  return rules.join(". ");

}