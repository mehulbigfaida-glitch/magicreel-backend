import { buildCampaignContext }
  from "./campaignContextMapper";

import { resolveContextProfile }
  from "../fashion-intelligence/resolvers/contextResolver";

import { resolveInjectedPacks }
  from "../fashion-intelligence/orchestration/packInjectionEngine";

const context =
  buildCampaignContext({
    campaignType:
      "new-arrival",

    tone:
      "luxury",

    backgroundStyle:
      "Royal Wedding",
  });

console.log(
  "\n===== CONTEXT =====\n"
);

console.log(context);

console.log(
  "\n===== PROFILE =====\n"
);

console.log(
  resolveContextProfile(
    context
  )
);

console.log(
  "\n===== PACKS =====\n"
);

console.log(
  resolveInjectedPacks(
    context
  )
);