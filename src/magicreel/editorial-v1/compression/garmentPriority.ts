export const garmentPrioritySignals = [
  // GARMENT HIERARCHY
  'garment remains primary visual subject',
  'fashion silhouette dominance preserved',
  'environment supports garment visibility',
  'cinematic composition prioritizes textile presentation',

  // TEXTILE REALISM
  'luxury fabric texture clarity',
  'natural textile gravity and drape behavior',
  'high-detail embroidery and stitching readability',
  'premium material realism with couture-level detail retention',

  // SILHOUETTE PRESERVATION
  'clean garment outline separation',
  'silhouette integrity maintained during pose transitions',
  'structured tailoring readability preservation',
  'full garment proportion consistency',

  // LIGHTING PRIORITY
  'lighting emphasizes textile depth and material richness',
  'controlled highlights preserving fabric realism',
  'shadow shaping supports garment dimensionality',

  // EDITORIAL FASHION QUALITY
  'luxury campaign-grade garment presentation',
  'high-fashion editorial textile rendering',
  'couture-inspired fabric behavior',
  'premium fashion photography realism',
]

export function buildGarmentPriority(): string {
  return garmentPrioritySignals.join(', ')
}