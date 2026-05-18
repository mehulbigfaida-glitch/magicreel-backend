export interface GarmentDNA {

  category: string;

  style:
    | "ethnic"
    | "western"
    | "fusion"
    | "unknown";

  garmentLength:
    | "cropped"
    | "waist"
    | "hip"
    | "knee"
    | "ankle"
    | "floor";

  footVisibility:
    | "visible"
    | "hidden";

  fit:
    | "slim"
    | "regular"
    | "oversized"
    | "unknown";

  sleeve:
    | "none"
    | "short"
    | "half"
    | "full"
    | "unknown";

  blousePresent: boolean;

  tuckState:
    | "tucked"
    | "untucked"
    | "unknown";

  layering:
    | "single"
    | "multi";

  closureState:
    | "open"
    | "closed"
    | "unknown";

  confidence:number;
}