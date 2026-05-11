import "dotenv/config";

import { generateCinematicPack } from "./magicreel/cinematic/generateCinematicPack";

const worlds = [
  "dark-aristocracy",
] as const;

/* ------------------------------------------------------- */

async function run() {
  for (const worldId of worlds) {
    console.log("\n");
    console.log("=================================================");
    console.log(`WORLD: ${worldId}`);
    console.log("=================================================");
    console.log("\n");

    const result = await generateCinematicPack({
      heroImageUrl:
        "https://res.cloudinary.com/duaqfspwa/image/upload/v1778356051/phyjljkamjuxm5cacrk2.png",

      worldId,

      brandName: "MagicReel",
    });

    console.log(result);
  }
}

run();