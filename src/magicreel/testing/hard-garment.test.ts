/* =========================================================
   HARD GARMENT PIPELINE TEST (TYPE-SAFE)
   ========================================================= */

import { classifyGarmentDifficulty } from "./garment.difficulty";
import { GarmentMeta } from "./garment.difficulty";

const samples: { name: string; meta: GarmentMeta }[] = [
  {
    name: "Straight Kurta",
    meta: {
      category: "ethnic",
      ethnic: true,
    },
  },
  {
    name: "Anarkali",
    meta: {
      category: "ethnic",
      ethnic: true,
      hasFlare: true,
    },
  },
  {
    name: "Asymmetric Dress",
    meta: {
      category: "dress",
      asymmetricHem: true,
    },
  },
];

for (const sample of samples) {
  const difficulty = classifyGarmentDifficulty(sample.meta);
  console.log(`${sample.name} → ${difficulty}`);
}
