export interface GarmentDNA {

  category:string;

  garmentName:string;

  // compatibility layer
  style?:string;

  garmentLength?:string;

  confidence?:number;

  layering?:string;

  [key:string]: any;

  isTop:boolean;

  isBottom:boolean;

  isOnePiece:boolean;

  isOverlay:boolean;

  isEthnic:boolean;

  isSet:boolean;

}