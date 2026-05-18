export interface GarmentDNA {

  category:string;

  garmentName?:string;

  style?:string;

  garmentLength?:string;

  footVisibility?:string;

  fit?:string;

  sleeve?:string;

  blousePresent?:boolean;

  tuckState?:string;

  layering?:string;

  closureState?:string;

  confidence?:number;

  // taxonomy layer
  isTop?:boolean;

  isBottom?:boolean;

  isOnePiece?:boolean;

  isOverlay?:boolean;

  isEthnic?:boolean;

  isSet?:boolean;

}