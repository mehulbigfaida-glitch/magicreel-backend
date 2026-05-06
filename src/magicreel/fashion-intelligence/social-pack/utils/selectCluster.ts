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

const directionMap: Record<CreativeDirection, string[]> = {
"High Fashion": ["Runway Dramatic", "Editorial Architectural"],
"Luxury Editorial": ["Editorial Architectural", "Minimal Luxury"],
"Minimal Fashion": ["Minimal Luxury"],
"Streetwear": ["Urban Cinematic"],
"Festive Couture": ["Runway Dramatic", "Editorial Architectural"],
};

let allowed = directionMap[direction];

// 🔥 BRAND INFLUENCE LAYER
if (brandProfile === "heritage") {
allowed = ["Editorial Architectural"];
}

if (brandProfile === "minimal") {
allowed = ["Minimal Luxury"];
}

if (brandProfile === "street") {
allowed = ["Urban Cinematic"];
}

const filtered = CINEMATIC_CLUSTERS.filter((c) =>
allowed.includes(c.name)
);

const index = Math.floor(Math.random() * filtered.length);

return filtered[index];
}
