export type LookbookPoseDefinition = {
  id: string;
  prompt: string;
};

export type LookbookCategoryPosePlan = {
  front: string;
  back: string;
  poses: LookbookPoseDefinition[];
};

export const LOOKBOOK_POSE_REGISTRY: Record<
  string,
  LookbookCategoryPosePlan
> = {

  top: {
    front:
      "Strict front-facing full-body presentation. Keep the complete top visible from neckline to hemline with unobstructed construction and natural relaxed posture.",

    back:
      "Strict back-facing full-body presentation clearly showing the rear construction, neckline, sleeves and hemline of the top.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Commercial three-quarter pose. Turn the torso 30 to 45 degrees toward camera, keep both feet grounded with one foot slightly offset, keep the face toward camera, bend one forearm naturally at the waist and leave the other arm relaxed away from the torso. Keep neckline, sleeves and hem unobstructed. Do not reproduce the straight Hero stance."
      },
      {
        id: "pose_2",
        prompt:
          "Dynamic weight-shift pose. Keep the upper body mostly upright while shifting body weight clearly onto one leg and placing the opposite foot slightly forward and outward. Use a distinctly different arm geometry: one arm relaxed alongside the body and the other lightly touching the opposite forearm. Keep the complete top visible; no walking."
      },
      {
        id: "pose_3",
        prompt:
          "Side silhouette pose. Rotate the torso 60 to 70 degrees from camera, align the legs in a clean side-oriented stance, keep the face turned back toward camera and hold both arms slightly separated from the torso. Prioritize the top's side length, shoulder line, sleeve profile and hem silhouette."
      }
    ]
  },

  tshirt: {
    front:
      "Strict front-facing full-body commercial presentation clearly showing the complete T-shirt, neckline, sleeves, print and branding.",

    back:
      "Strict back-facing full-body presentation clearly showing the rear T-shirt construction and visible branding.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Commercial three-quarter T-shirt pose. Rotate the torso 30 to 45 degrees, keep both feet grounded with one foot slightly offset, one arm relaxed and the other loosely bent. Keep print, neckline, sleeves and hem completely visible."
      },
      {
        id: "pose_2",
        prompt:
          "Contemporary casual weight-shift pose. Place most weight on one leg and move the other foot clearly forward and outward, with one hand in a relaxed low position and the opposite arm naturally away from the body. Keep the T-shirt unobstructed and do not create walking motion."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side-profile T-shirt pose. Turn the body 60 to 70 degrees from camera, keep the face turned back toward camera and separate the arms from the torso. Show T-shirt length, sleeve profile, side seam and hem clearly."
      }
    ]
  },

  shirt_blouse: {
    front:
      "Strict front-facing full-body presentation showing collar or neckline, buttons, sleeves, cuffs and hemline.",

    back:
      "Strict back-facing full-body presentation showing rear collar, back construction, sleeves and hemline.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Structured three-quarter shirt/blouse pose. Turn torso 30 to 45 degrees, keep feet grounded with one foot slightly offset, one arm relaxed and the other naturally bent near the waist. Clearly expose collar, placket, buttons, sleeves and cuffs."
      },
      {
        id: "pose_2",
        prompt:
          "Editorial stance for construction. Shift weight clearly onto one leg, place the other foot slightly forward, and use a deliberate shoulder-level gesture with one hand lightly near the opposite upper arm while the other arm hangs relaxed. Keep collar, placket and cuffs visible; no walking."
      },
      {
        id: "pose_3",
        prompt:
          "Side construction pose. Rotate body 60 to 70 degrees, keep face turned toward camera, align arms away from torso and show the shirt/blouse length, side seam, sleeve shape and hem."
      }
    ]
  },

  one_piece: {
    front:
      "Strict front-facing full-body presentation of the complete one-piece garment from neckline to hem.",

    back:
      "Strict back-facing full-body presentation showing the complete rear one-piece construction. Preserve the source garment's original coverage and construction. Do not increase, widen, lower or otherwise alter any neckline, opening, slit, drape or exposed area.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Conservative commercial three-quarter product pose. Rotate the torso approximately 30 to 40 degrees toward camera while maintaining a natural upright standing posture. Keep both arms relaxed and clearly outside the garment. Keep the complete one-piece silhouette, neckline, sleeves, draped panels and hem clearly visible. Preserve the exact source garment coverage and openings; do not widen, raise, lower, open, pull, separate or reinterpret any slit, neckline, drape or exposed area. Do not emphasize the model's body or exposed skin."
      },
      {
        id: "pose_2",
        prompt:
          "Controlled commercial standing pose with a subtle weight shift onto one leg and the opposite foot only slightly offset. Keep both arms relaxed and away from the garment. Keep the complete one-piece construction clearly visible without dramatic leg positioning or garment movement. Preserve the exact source garment coverage, openings, draped panels and asymmetric construction; do not widen, raise, lower, open, pull, separate or reinterpret any slit, neckline, drape or exposed area. Do not emphasize the model's body or exposed skin. No walking."
      },
      {
        id: "pose_3",
        prompt:
          "Conservative three-quarter side product view. Rotate the body approximately 45 to 55 degrees rather than a deep side profile, keep the face naturally toward camera and keep both arms relaxed outside the garment. Clearly show the one-piece length, side construction, sleeves and natural drape while preserving the exact source garment coverage. Do not widen, raise, lower, open, pull, separate or reinterpret any slit, neckline, drape or exposed area. Do not emphasize the model's body or exposed skin."
      }
    ]
  },

  saree: {
    front:
      "Strict straight-on full-body saree presentation. Face the camera directly with both shoulders parallel to the camera. Clearly display the blouse, saree pleats, border and full pallu. Preserve the exact Hero-style product presentation.",

    back:
      "Strict back-facing full-body saree presentation. The model faces directly away from the camera. Clearly show the rear saree drape, blouse construction, pleats, border and pallu relationship.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Elegant three-quarter saree pose. Rotate the body 30 to 45 degrees, keep one foot slightly forward, face toward camera, place one hand gently near the waist and allow the other arm to fall naturally. Keep blouse, pleats, border and pallu fully readable."
      },
      {
        id: "pose_2",
        prompt:
          "Graceful weight-shift saree pose. Place most weight on the rear leg with the front foot slightly advanced and outward. One hand lightly manages the pallu near the shoulder while the other rests low near the waist. Keep the complete drape visible and avoid repeating Pose 1."
      },
      {
        id: "pose_3",
        prompt:
          "Side silhouette and pallu-fall pose. Rotate body 60 to 70 degrees, turn head back toward camera, keep one arm relaxed in front and the other slightly behind the torso. Allow the pallu to fall naturally along the side so pleats, border and full saree silhouette are clearly visible."
      }
    ]
  },

  overlay_jacket: {
    front:
      "Strict front-facing full-body presentation clearly showing the complete overlay or jacket, collar, closures, sleeves and layering.",

    back:
      "Strict back-facing full-body presentation showing the rear overlay or jacket construction and silhouette.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Three-quarter layering pose. Rotate torso 30 to 45 degrees with one foot slightly offset. Keep one arm relaxed and the other naturally away from the body so the jacket/overlay and underlying garment remain clearly separated."
      },
      {
        id: "pose_2",
        prompt:
          "Layer-detail editorial pose. Shift weight onto one leg and place the other foot slightly forward. Lightly touch the lapel, collar or front edge with one hand while the opposite arm remains relaxed. Keep closures, sleeves and layering unobstructed."
      },
      {
        id: "pose_3",
        prompt:
          "Side silhouette layering pose. Rotate body 60 to 70 degrees, turn face toward camera and separate the arms from the torso. Emphasize jacket length, sleeve profile, outer silhouette and rear fall."
      }
    ]
  },

  bottoms: {
    front:
      "Strict front-facing full-body presentation showing waistband, rise, leg silhouette, pleats and hemline.",

    back:
      "Strict back-facing full-body presentation showing rear waistband, seat construction, leg silhouette and hemline.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Commercial three-quarter bottoms pose. Rotate torso 30 to 45 degrees, place one leg slightly forward and outward, keep the upper body relaxed and arms clear of the waistband. Clearly reveal waistband, rise, leg shape and hem."
      },
      {
        id: "pose_2",
        prompt:
          "Lower-body editorial stance. Shift weight strongly onto one leg and place the opposite foot diagonally forward, creating a clearly different leg geometry. Keep both hands relaxed away from the waistband so the rise, pleats and fabric fall remain visible. No walking."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side-profile bottoms pose. Rotate body 60 to 70 degrees, keep legs readable in profile and arms away from the lower garment. Emphasize waistband, rise, side seam, leg silhouette and hem."
      }
    ]
  },

  top_bottom: {
    front:
      "Strict front-facing full-body presentation of the coordinated Top & Bottom outfit. Keep the upper and lower garments visually distinct.",

    back:
      "Strict back-facing full-body presentation showing both coordinated garment components and their relationship.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Three-quarter coordinated-outfit pose. Rotate torso 30 to 45 degrees with one foot slightly offset, one arm relaxed and one naturally bent. Keep the top and bottom visually separated and fully readable."
      },
      {
        id: "pose_2",
        prompt:
          "Dynamic coordinated-outfit weight shift. Put most weight on one leg and move the other foot clearly forward/outward. Use asymmetric arms with one hand lightly near the opposite forearm and the other relaxed. Keep both garment components unobstructed; no walking."
      },
      {
        id: "pose_3",
        prompt:
          "Side-oriented coordinated silhouette. Rotate body 60 to 70 degrees, turn face toward camera and separate arms from torso. Clearly show the proportions, lengths and relationship of the top and bottom."
      }
    ]
  },

  ethnic_set: {
    front:
      "Strict front-facing full-body presentation of the complete coordinated Ethnic Set, with all components visible and clearly related.",

    back:
      "Strict back-facing full-body presentation of the complete Ethnic Set, preserving all rear components.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Elegant three-quarter ethnic pose. Rotate torso 30 to 45 degrees, offset one foot slightly, keep one arm relaxed and the other naturally bent near the waist. Keep every major garment component visible."
      },
      {
        id: "pose_2",
        prompt:
          "Graceful ethnic weight-shift pose. Transfer weight onto one leg and place the other foot diagonally forward. Where a dupatta is present, one hand may lightly manage it near the shoulder while the opposite arm stays relaxed. Keep all components readable; no walking."
      },
      {
        id: "pose_3",
        prompt:
          "Strong ethnic side silhouette. Rotate body 60 to 70 degrees, turn face toward camera and keep arms separated from the torso. Emphasize garment length, layering, lower garment and fabric fall."
      }
    ]
  },

  kurta_sets: {
    front:
      "Strict front-facing full-body presentation of the complete Kurta Set, clearly showing kurta length, sleeves, neckline and coordinated bottom.",

    back:
      "Strict back-facing full-body presentation showing rear kurta construction and coordinated bottom.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Elegant three-quarter Kurta Set pose. Rotate torso 30 to 45 degrees, offset one foot, keep one hand relaxed and the other naturally near the waist. Clearly show kurta length, sleeves and coordinated bottom."
      },
      {
        id: "pose_2",
        prompt:
          "Kurta Set editorial weight shift. Put weight on one leg and place the other foot forward/outward. Where a dupatta is present, lightly touch it near the shoulder with one hand; otherwise use a relaxed low hand position. Keep the kurta and bottom unobstructed."
      },
      {
        id: "pose_3",
        prompt:
          "Side-oriented Kurta Set silhouette. Rotate body 60 to 70 degrees, face back toward camera and separate arms from torso. Clearly reveal kurta side fall, length and coordinated lower garment."
      }
    ]
  },

  sharara_sets: {
    front:
      "Strict front-facing full-body presentation of the complete Sharara Set. The lower garment is a sharara with two distinct wide flared legs. Keep the divided construction visible.",

    back:
      "Strict back-facing full-body presentation of the complete Sharara Set while preserving the two distinct sharara legs and coordinated upper garment.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Three-quarter Sharara presentation. Rotate torso 30 to 45 degrees, offset one foot and keep the arms clear of the lower garment. Deliberately preserve visible separation between the two wide sharara legs."
      },
      {
        id: "pose_2",
        prompt:
          "Dynamic Sharara stance. Shift weight strongly onto one leg and place the other leg forward and outward so the two flared legs remain visibly distinct. Use asymmetric relaxed arms; no walking and never merge the sharara into a skirt."
      },
      {
        id: "pose_3",
        prompt:
          "Side Sharara silhouette. Rotate body 60 to 70 degrees and keep the face toward camera. Position legs so the divided lower construction remains readable from the side, with arms separated from the garment. Preserve flare and fabric volume."
      }
    ]
  },

  lehenga_set: {
    front:
      "Strict front-facing full-body presentation of the complete Lehenga Set. Clearly distinguish blouse, lehenga skirt and dupatta.",

    back:
      "Strict back-facing full-body presentation showing rear blouse construction, skirt volume and dupatta placement.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Elegant three-quarter Lehenga pose. Rotate torso 30 to 45 degrees, offset one foot and use graceful asymmetric hands. Keep blouse, skirt and dupatta clearly separated and fully visible."
      },
      {
        id: "pose_2",
        prompt:
          "Controlled Lehenga editorial weight shift. Put weight on one leg and move the other foot slightly forward/outward. Use one hand lightly near the dupatta or waist and the other relaxed. Let the skirt show natural flare without spinning or lifting."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side Lehenga silhouette. Rotate body 60 to 70 degrees, turn face toward camera and keep arms away from the skirt. Clearly reveal skirt volume, waist fit, side profile and dupatta fall."
      }
    ]
  },

  dhoti_kurta: {
    front:
      "Strict front-facing full-body presentation of the complete Dhoti Kurta outfit. The lower garment is specifically a dhoti. Preserve its distinct folds, volume and silhouette.",

    back:
      "Strict back-facing full-body presentation of the complete Dhoti Kurta outfit. Preserve the dhoti as the lower garment and show its rear construction.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Elegant three-quarter Dhoti Kurta pose. Rotate torso 30 to 45 degrees, offset one foot and keep arms naturally asymmetric. Preserve the dhoti as a distinct lower garment with visible folds and volume."
      },
      {
        id: "pose_2",
        prompt:
          "Dhoti construction stance. Shift weight onto one leg and place the other leg clearly forward and outward without walking. Keep both arms away from the lower garment so the divided dhoti folds and volume remain readable."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side Dhoti Kurta silhouette. Rotate body 60 to 70 degrees, face toward camera and separate the arms from the torso. Emphasize dhoti folds, volume and lower-body construction; do not reinterpret it as trousers, salwar, churidar or skirt."
      }
    ]
  },

  anarkali: {
    front:
      "Strict front-facing full-body presentation of the complete Anarkali outfit, showing neckline, sleeves, long flared silhouette and visible dupatta.",

    back:
      "Strict back-facing full-body presentation showing rear Anarkali construction, flare, sleeves and visible dupatta relationship.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Elegant three-quarter Anarkali pose. Rotate torso 30 to 45 degrees, offset one foot and use graceful asymmetric hands. Keep the full-length flare and dupatta visible without obstruction."
      },
      {
        id: "pose_2",
        prompt:
          "Anarkali weight-shift editorial pose. Transfer weight onto one leg and move the other foot slightly forward/outward. Keep one hand lightly near the waist or dupatta and the other relaxed, allowing the flare to remain unobstructed. Do not spin."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side Anarkali silhouette. Rotate body 60 to 70 degrees, turn face toward camera and separate arms from the torso. Emphasize full length, flare, side construction and natural fabric volume."
      }
    ]
  }
};

export function getLookbookCategoryPoses(
  category: string
): LookbookCategoryPosePlan | null {

  const raw = category.trim().toLowerCase();

  const aliases: Record<string, string> = {
    "top": "top",
    "t-shirt": "tshirt",
    "tshirt": "tshirt",
    "shirt": "shirt_blouse",
    "shirt / blouse": "shirt_blouse",
    "shirt/blouse": "shirt_blouse",
    "one-piece": "one_piece",
    "one piece": "one_piece",
    "saree": "saree",
    "overlay / jacket": "overlay_jacket",
    "overlay/jacket": "overlay_jacket",
    "bottoms": "bottoms",
    "top & bottom": "top_bottom",
    "top and bottom": "top_bottom",
    "ethnic set": "ethnic_set",
    "kurta sets": "kurta_sets",
    "kurta set": "kurta_sets",
    "sharara sets": "sharara_sets",
    "sharara set": "sharara_sets",
    "lehenga set": "lehenga_set",
    "lehenga": "lehenga_set",
    "dhoti kurta": "dhoti_kurta",
    "anarkali": "anarkali"
  };

  const key = aliases[raw] || raw;

  return LOOKBOOK_POSE_REGISTRY[key] || null;
}