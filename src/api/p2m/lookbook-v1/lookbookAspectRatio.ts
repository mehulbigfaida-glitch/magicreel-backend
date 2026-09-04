export const LOOKBOOK_ASPECT_RATIOS = {
  "2:3": { width: 1240, height: 1860 },
  "3:4": { width: 1500, height: 2000 },
  "4:5": { width: 1856, height: 2320 },
  "1:1": { width: 2000, height: 2000 },
} as const;

export type LookbookAspectRatio = keyof typeof LOOKBOOK_ASPECT_RATIOS;

export function isLookbookAspectRatio(
  value: unknown
): value is LookbookAspectRatio {
  return typeof value === "string" && value in LOOKBOOK_ASPECT_RATIOS;
}

export function getLookbookDimensions(
  value: unknown
) {
  if (!isLookbookAspectRatio(value)) {
    throw new Error(
      "Unsupported Lookbook aspect ratio. Use 2:3, 3:4, 4:5 or 1:1."
    );
  }

  return LOOKBOOK_ASPECT_RATIOS[value];
}
