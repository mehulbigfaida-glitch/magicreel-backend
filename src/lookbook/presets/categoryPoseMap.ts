export const CATEGORY_POSE_MAP: Record<string, [string, string]> = {
  TOP: ["side_profile", "detail_zoom"],
  SHIRT: ["side_profile", "collar_zoom"],
  BLOUSE: ["side_profile", "neckline_zoom"],

  DRESS: ["movement", "fabric_flow"],
  ONE_PIECE: ["movement", "fabric_flow"],

  BOTTOM: ["waist_fit_zoom", "leg_silhouette"],

  SAREE: ["pallu_detail", "border_zoom"],
  ETHNIC_SET: ["drape_detail", "embroidery_zoom"],

  JACKET: ["open_front", "texture_zoom"],

  DEFAULT: ["movement", "detail_zoom"]
}
