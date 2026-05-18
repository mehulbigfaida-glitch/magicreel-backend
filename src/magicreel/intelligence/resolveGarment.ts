import { GarmentDNA } from "./types";

export function resolveGarment(
  category?: string,
  garmentName?: string
): GarmentDNA {

  const text =
    `${category || ""} ${garmentName || ""}`
      .toLowerCase();


  // =========================================
  // BASE DEFAULT
  // =========================================

  const base: GarmentDNA = {

    category:"unknown",

    style:"unknown",

    garmentLength:"hip",

    footVisibility:"visible",

    fit:"regular",

    sleeve:"unknown",

    blousePresent:false,

    tuckState:"unknown",

    layering:"single",

    closureState:"unknown",

    confidence:.50

  };



  // =========================================
  // SAREE
  // =========================================

  if(
      text.includes("saree")
  ){

    return{

      ...base,

      category:"saree",

      style:"ethnic",

      garmentLength:"floor",

      footVisibility:"hidden",

      blousePresent:true,

      confidence:.95

    };

  }



  // =========================================
  // LEHENGA
  // =========================================

  if(
      text.includes("lehenga")
  ){

    return{

      ...base,

      category:"lehenga",

      style:"ethnic",

      garmentLength:"floor",

      footVisibility:"hidden",

      confidence:.92

    };

  }



  // =========================================
  // KURTA
  // =========================================

  if(
      text.includes("kurta")
  ){

    return{

      ...base,

      category:"kurta",

      style:"ethnic",

      garmentLength:"knee",

      footVisibility:"visible",

      confidence:.90

    };

  }



  // =========================================
  // KURTA DHOTI
  // =========================================

  if(
      text.includes("dhoti")
  ){

    return{

      ...base,

      category:"kurta_dhoti",

      style:"ethnic",

      garmentLength:"knee",

      footVisibility:"visible",

      confidence:.92

    };

  }



  // =========================================
  // KAFTAN
  // =========================================

  if(
      text.includes("kaftan")
  ){

    return{

      ...base,

      category:"kaftan",

      style:"ethnic",

      garmentLength:"ankle",

      footVisibility:"hidden",

      fit:"oversized",

      confidence:.92

    };

  }



  // =========================================
  // PONCHO
  // =========================================

  if(
      text.includes("poncho")
  ){

    return{

      ...base,

      category:"poncho_set",

      style:"ethnic",

      garmentLength:"ankle",

      footVisibility:"hidden",

      fit:"oversized",

      confidence:.88

    };

  }



  // =========================================
  // DRAPED
  // =========================================

  if(
      text.includes("drape")
      ||
      text.includes("draped")
  ){

    return{

      ...base,

      category:"ethnic_drape_gown",

      style:"ethnic",

      garmentLength:"floor",

      footVisibility:"hidden",

      fit:"oversized",

      confidence:.85

    };

  }



  // =========================================
  // CO-ORD
  // =========================================

  if(
      text.includes("co-ord")
      ||
      text.includes("coord")
      ||
      text.includes("co ord")
  ){

    return{

      ...base,

      category:"co_ord",

      style:"western",

      confidence:.85

    };

  }



  // =========================================
  // SHIRT
  // =========================================

  if(
      text.includes("shirt")
  ){

    return{

      ...base,

      category:"shirt",

      style:"western",

      garmentLength:"hip",

      tuckState:"unknown",

      confidence:.85

    };

  }



  // =========================================
  // BLAZER
  // =========================================

  if(
      text.includes("blazer")
      ||
      text.includes("jacket")
  ){

    return{

      ...base,

      category:"blazer",

      style:"western",

      layering:"multi",

      closureState:"unknown",

      confidence:.90

    };

  }



  // =========================================
  // UNKNOWN ETHNIC
  // =========================================

  if(
      text.includes("ethnic")
      ||
      text.includes("indian")
  ){

    return{

      ...base,

      category:"unknown_ethnic",

      style:"ethnic",

      confidence:.60

    };

  }



  return base;

}