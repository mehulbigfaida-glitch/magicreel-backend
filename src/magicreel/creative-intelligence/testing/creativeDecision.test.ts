import {
  creativeDecisionService,
} from "../creativeDecision.service";

async function run() {

  try {

    const heroImageUrl =
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1782551644/rjh4b76icrw4nmyjy28l.png";

    const result =
      await creativeDecisionService.generateDecision({

        heroImageUrl,

        communication:
          "New Arrival",

        headline:
          "NEW ARRIVALS",

        subheadline:
          "Discover the latest collection.",

        cta:
          "Shop Now",

      });

    console.log("\n========================================");
    console.log("CREATIVE DECISION");
    console.log("========================================\n");

    console.dir(result, {
      depth: null,
      colors: true,
    });

    console.log("\n========================================\n");

  } catch (err) {

    console.error(
      "Creative Decision Test Failed"
    );

    console.error(err);

  }

}

run();
