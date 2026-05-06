import { CINEMATIC_CLUSTERS } from "../cinematicClusters";
import { CreativeDirection } from "../socialPack.types";

function detectBrandProfile(
brandName?: string,
direction?: CreativeDirection,
heading?: string,
subheading?: string
) {
const text = `${brandName || ""} ${heading || ""} ${subheading || ""}`.toLowerCase();

// 🔥 STRONG SIGNALS

if (
text.includes("minimal") ||
text.includes("clean") ||
text.includes("essential") ||
direction === "Minimal Fashion"
) {
return "minimal";
}

if (
text.includes("street") ||
text.includes("urban") ||
text.includes("club") ||
text.includes("culture") ||
text.includes("drop") ||
direction === "Streetwear"
) {
return "street";
}

if (
text.includes("couture") ||
text.includes("atelier") ||
text.includes("royal") ||
text.includes("heritage") ||
text.includes("bridal") ||
direction === "Festive Couture"
) {
return "heritage";
}

return "modern";
}

export function selectCluster(
direction: CreativeDirection,
brandName?: string,
heading?: string,
subheading?: string
) {
const profile = detectBrandProfile(
brandName,
direction,
heading,
subheading
);

// 🔥 HARD CONTROL

if (profile === "minimal") {
return CINEMATIC_CLUSTERS.find(
(c) => c.name === "Minimal Luxury"
)!;
}

if (profile === "street") {
return CINEMATIC_CLUSTERS.find(
(c) => c.name === "Urban Cinematic"
)!;
}

if (profile === "heritage") {
return CINEMATIC_CLUSTERS.find(
(c) => c.name === "Editorial Architectural"
)!;
}

// fallback
const directionMap: Record<CreativeDirection, string[]> = {
"High Fashion": ["Runway Dramatic", "Editorial Architectural"],
"Luxury Editorial": ["Editorial Architectural", "Minimal Luxury"],
"Minimal Fashion": ["Minimal Luxury"],
"Streetwear": ["Urban Cinematic"],
"Festive Couture": ["Runway Dramatic", "Editorial Architectural"],
};

const allowed = directionMap[direction];

const filtered = CINEMATIC_CLUSTERS.filter((c) =>
allowed.includes(c.name)
);

const index = Math.floor(Math.random() * filtered.length);

return filtered[index];
}
