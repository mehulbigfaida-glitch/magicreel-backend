import { CINEMATIC_CLUSTERS } from "../cinematicClusters";
import { CreativeDirection } from "../socialPack.types";

function detectBrandProfile(brandName?: string) {
if (!brandName) return "neutral";

const name = brandName.toLowerCase();

if (
name.includes("couture") ||
name.includes("atelier") ||
name.includes("royal") ||
name.includes("heritage")
) {
return "heritage";
}

if (
name.includes("studio") ||
name.includes("collective") ||
name.includes("lab") ||
name.includes("minimal")
) {
return "minimal";
}

if (
name.includes("street") ||
name.includes("urban") ||
name.includes("club") ||
name.includes("culture")
) {
return "street";
}

return "modern";
}

export function selectCluster(
direction: CreativeDirection,
brandName?: string
) {
const brandProfile = detectBrandProfile(brandName);

// 🔥 HARD BRAND OVERRIDE
if (brandProfile === "minimal") {
return CINEMATIC_CLUSTERS.find(
(c) => c.name === "Minimal Luxury"
)!;
}

if (brandProfile === "street") {
return CINEMATIC_CLUSTERS.find(
(c) => c.name === "Urban Cinematic"
)!;
}

if (brandProfile === "heritage") {
return CINEMATIC_CLUSTERS.find(
(c) => c.name === "Editorial Architectural"
)!;
}

// 🔁 fallback to direction-based logic
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
