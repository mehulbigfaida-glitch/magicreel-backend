"use strict";
/* =========================================================
   HARD GARMENT PIPELINE TEST (TYPE-SAFE)
   ========================================================= */
Object.defineProperty(exports, "__esModule", { value: true });
const garment_difficulty_1 = require("./garment.difficulty");
const samples = [
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
    const difficulty = (0, garment_difficulty_1.classifyGarmentDifficulty)(sample.meta);
    console.log(`${sample.name} → ${difficulty}`);
}
