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
          "Three-quarter front presentation. Turn the torso approximately 30 to 45 degrees toward the camera while keeping the face toward camera. One forearm is naturally bent near the waist and the opposite arm remains relaxed. Clearly reveal neckline, sleeve construction, hemline and overall silhouette. Do not reproduce the straight Hero stance."
      },
      {
        id: "pose_2",
        prompt:
          "Refined upper-body gesture. Maintain a three-quarter body angle and place one hand naturally near the shoulder or upper chest while the opposite arm rests near the waist. The gesture must reveal neckline, sleeve and shoulder construction. Do not use the arm configuration of Pose 1."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side-oriented silhouette. Turn the torso approximately 60 degrees away from camera while keeping the face toward camera. Keep both arms away from the torso enough to reveal the garment outline and hem. Do not use a frontal standing pose."
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
          "Relaxed three-quarter fashion pose with one forearm naturally bent and the other relaxed. Keep the T-shirt fully visible and show shoulder, sleeve and hem shape."
      },
      {
        id: "pose_2",
        prompt:
          "Confident asymmetric casual pose with a subtle torso angle and deliberate arm geometry. Keep the T-shirt unobstructed and distinct from the Hero stance."
      },
      {
        id: "pose_3",
        prompt:
          "Side-oriented silhouette pose with the torso approximately 60 degrees from camera. Clearly show T-shirt length, sleeve profile and natural fit. Avoid walking."
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
          "Three-quarter front fashion pose with torso angled 30 to 45 degrees, one forearm naturally bent and the opposite arm relaxed. Clearly reveal collar, placket, sleeves and cuffs."
      },
      {
        id: "pose_2",
        prompt:
          "Editorial shoulder gesture. Maintain a three-quarter angle, raise one hand naturally near the shoulder or neckline while the opposite hand rests near the waist. Keep collar and sleeve construction visible."
      },
      {
        id: "pose_3",
        prompt:
          "Side-oriented silhouette showing shirt or blouse length, shoulder line, sleeve shape and hem. Avoid repeating the frontal Hero posture."
      }
    ]
  },

  one_piece: {
    front:
      "Strict front-facing full-body presentation of the complete one-piece garment from neckline to hem.",

    back:
      "Strict back-facing full-body presentation showing the complete rear one-piece construction.",

    poses: [
      {
        id: "pose_1",
        prompt:
          "Elegant three-quarter pose with clear torso rotation and a natural asymmetric arm arrangement. Preserve the entire one-piece silhouette."
      },
      {
        id: "pose_2",
        prompt:
          "Refined shoulder and waist gesture. One hand naturally approaches the shoulder or upper torso while the other rests near the waist. Keep the full garment visible."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side silhouette with approximately 60-degree torso rotation, clearly showing garment length, side construction and natural drape."
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
          "ELEGANT THREE-QUARTER SAREE POSE. Rotate the body clearly into a three-quarter angle, approximately 30 to 45 degrees from the camera, while turning the face naturally toward the camera. Compose both hands naturally together near the waist. Show the complete saree silhouette, blouse, pleats, border and pallu. This must be visibly different from the straight-on Hero pose. Do not reproduce a frontal neutral stance."
      },
      {
        id: "pose_2",
        prompt:
          "EDITORIAL SHOULDER GESTURE SAREE POSE. Turn the body into a clear three-quarter fashion angle. Raise one hand naturally near the shoulder or neckline while the opposite hand rests elegantly near the waist. Turn the head slightly away from camera while preserving facial identity. Keep the complete saree, pallu, border and pleats visible. Use a distinctly different arm configuration from the Hero and Pose 1."
      },
      {
        id: "pose_3",
        prompt:
          "SIDE SILHOUETTE AND PALLU FALL SAREE POSE. Rotate the body approximately 60 to 70 degrees away from the camera to create a strong side-oriented silhouette, while turning the head back toward camera. Place the weight naturally on the rear leg with a subtle elegant hip shift. Keep the front arm relaxed and the opposite arm slightly behind the torso. Allow the pallu to fall naturally and visibly along the body. Clearly show saree pleats, border, pallu and full silhouette."
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
          "Three-quarter open-layer presentation. Angle the torso 30 to 45 degrees and keep the front layer naturally visible so the viewer can understand the relationship between the overlay and underlying outfit."
      },
      {
        id: "pose_2",
        prompt:
          "Refined lapel or shoulder gesture. One hand naturally approaches the lapel, collar or front edge while the opposite arm rests near the waist. Clearly show the outer-layer construction."
      },
      {
        id: "pose_3",
        prompt:
          "Side-oriented silhouette approximately 60 degrees from camera, clearly revealing overlay length, sleeve profile, layering and rear fall."
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
          "Three-quarter front presentation with one leg subtly advanced and weight shifted naturally. Clearly reveal waistband, rise, leg shape and hemline."
      },
      {
        id: "pose_2",
        prompt:
          "Strong side-profile presentation showing the lower garment's side silhouette, length and fabric behaviour. Keep both legs visually readable."
      },
      {
        id: "pose_3",
        prompt:
          "Controlled crossed-leg fashion stance with one leg crossing naturally in front of the other, keeping the garment silhouette, hem and fabric construction visible. Do not create walking motion."
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
          "Three-quarter coordinated-outfit pose. Angle the torso 30 to 45 degrees while maintaining clear separation between the top and bottom."
      },
      {
        id: "pose_2",
        prompt:
          "Upper-body gesture with one hand near the shoulder or waist and the other relaxed. The separate top and bottom must remain clearly readable."
      },
      {
        id: "pose_3",
        prompt:
          "Side-oriented silhouette approximately 60 degrees from camera, clearly revealing the relationship, lengths and proportions of the separate top and bottom garments."
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
          "Elegant three-quarter ethnic pose with graceful hand placement and clear visibility of all major outfit components."
      },
      {
        id: "pose_2",
        prompt:
          "Refined ethnic gesture with one hand naturally near the shoulder, dupatta or upper torso where present, and the other near the waist. Keep every major garment component visible."
      },
      {
        id: "pose_3",
        prompt:
          "Side-oriented ethnic silhouette showing garment length, layering, lower garment and natural fabric fall."
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
          "Elegant three-quarter Kurta Set pose with one hand naturally near the waist and the other relaxed. Clearly show kurta length, sleeves and coordinated bottom."
      },
      {
        id: "pose_2",
        prompt:
          "Upper-body ethnic gesture. Where a dupatta is present, one hand naturally manages or lightly touches the dupatta near the shoulder while keeping the kurta and bottom visible. Without a dupatta, use a clean shoulder/neckline gesture instead."
      },
      {
        id: "pose_3",
        prompt:
          "Side-oriented silhouette approximately 60 degrees from camera, clearly revealing kurta length, side fall and coordinated lower garment."
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
          "Three-quarter Sharara Set pose. Angle the torso 30 to 45 degrees while keeping the two distinct sharara legs visibly separated. Clearly show the upper garment and the flared lower construction."
      },
      {
        id: "pose_2",
        prompt:
          "Sharara-leg presentation pose. Place the weight primarily on one leg while slightly positioning the other leg forward and away from it, creating a clear visual separation between the two flared sharara legs. Do not reinterpret the garment as a lehenga skirt."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side-oriented Sharara silhouette approximately 60 degrees from camera. Clearly show the two-leg construction, flare, fabric volume and natural separation. Do not merge the sharara legs into a single skirt-like silhouette."
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
          "Elegant three-quarter Lehenga Set pose with clear torso rotation and graceful hand placement. Preserve the distinction between blouse, skirt and dupatta."
      },
      {
        id: "pose_2",
        prompt:
          "Controlled lehenga-flare presentation. Position the body in an elegant three-quarter angle and allow the skirt to open naturally enough to reveal its flare and volume while keeping the dupatta visible and intact. Do not spin."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side-oriented Lehenga Set silhouette approximately 60 degrees from camera, clearly revealing skirt volume, waist fit and dupatta fall."
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
          "Elegant three-quarter Dhoti Kurta pose with clear torso rotation and natural arm placement. Keep the dhoti visibly readable as a distinct lower garment."
      },
      {
        id: "pose_2",
        prompt:
          "Dhoti-construction presentation. Position one leg slightly forward and the opposite leg naturally behind without walking. The stance must clearly expose the dhoti folds, volume and divided lower construction."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side-oriented Dhoti Kurta silhouette approximately 60 degrees from camera, clearly revealing the dhoti folds, volume and lower-body construction. Do not reinterpret the dhoti as trousers, pants, salwar, churidar or skirt."
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
          "Elegant three-quarter Anarkali pose with clear torso angle and graceful hand placement. Preserve the full-length flared silhouette."
      },
      {
        id: "pose_2",
        prompt:
          "Controlled flare presentation. Angle the torso slightly and position the arms so the lower flare remains unobstructed. Where a dupatta is present, keep it naturally visible without hiding the flare."
      },
      {
        id: "pose_3",
        prompt:
          "Strong side-oriented Anarkali silhouette approximately 60 degrees from camera, clearly showing length, flare and natural fabric volume."
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