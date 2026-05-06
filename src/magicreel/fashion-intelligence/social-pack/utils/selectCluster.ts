import { CINEMATIC_CLUSTERS } from "../cinematicClusters";
import { CreativeDirection } from "../socialPack.types";

export function selectCluster(direction: CreativeDirection) {
const clusterMap: Record<CreativeDirection, string[]> = {
"High Fashion": ["Runway Dramatic", "Editorial Architectural"],
"Luxury Editorial": ["Editorial Architectural", "Minimal Luxury"],
"Minimal Fashion": ["Minimal Luxury"],
"Streetwear": ["Urban Cinematic"],
"Festive Couture": ["Runway Dramatic", "Editorial Architectural"],
};

const allowedClusters = clusterMap[direction];

const filtered = CINEMATIC_CLUSTERS.filter((cluster) =>
allowedClusters.includes(cluster.name)
);

const index = Math.floor(Math.random() * filtered.length);

return filtered[index];
}
