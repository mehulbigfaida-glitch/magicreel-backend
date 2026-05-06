import { CINEMATIC_CLUSTERS } from "../cinematicClusters";

export function selectCluster() {
const index = Math.floor(Math.random() * CINEMATIC_CLUSTERS.length);
return CINEMATIC_CLUSTERS[index];
}
