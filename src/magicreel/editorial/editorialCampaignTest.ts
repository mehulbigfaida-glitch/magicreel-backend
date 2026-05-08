import { buildEditorialCampaign } from "./editorialCampaignBuilder";

const result = buildEditorialCampaign(
  {
    category: "black evening gown",

    western: true,

    colorPalette: ["black", "charcoal"],

    silhouette: "structured",

    mood: "luxury couture",
  },

  [
    "hero",
    "instagram-post",
    "story",
    "reel",
  ]
);

console.log("\n");
console.log("======= MAGICREEL CAMPAIGN TEST =======");
console.log("\n");

console.log("PRIMARY WORLD:");
console.log(result.primaryWorld);

console.log("\n");

console.log("EMOTIONAL THESIS:");
console.log(result.emotionalThesis);

console.log("\n");

console.log("ASSETS:");
console.log("\n");

result.assets.forEach((asset, index) => {
  console.log(`${index + 1}. ${asset.assetType.toUpperCase()}`);

  console.log("Composition:");
  console.log(asset.compositionIntent);

  console.log("\nFraming:");
  console.log(asset.framingDirection.join(", "));

  console.log("\nMood:");
  console.log(asset.moodDirection.join(", "));

  console.log("\nTypography:");
  console.log(asset.typographyBehavior.join(", "));

  if (asset.motionDirection) {
    console.log("\nMotion:");
    console.log(asset.motionDirection.join(", "));
  }

  console.log("\n-----------------------------------\n");
});

console.log("======================================");
console.log("\n");