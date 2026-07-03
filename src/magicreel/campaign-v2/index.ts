/**
 * ============================================================================
 * MagicReel Campaign Engine V2
 * Module Entry Point
 * ============================================================================
 */

import campaignGenerationRoutes
  from "./routes/campaignGeneration.routes";

export {
  campaignGenerationRoutes,
};

export {
  default as campaignGenerationController,
} from "./controllers/campaignGeneration.controller";

export {
  default as campaignGenerationService,
} from "./campaignGeneration.service";

export {
  default as visualIntelligenceService,
} from "./visual-intelligence/visualIntelligence.service";

export {
  default as campaignDirectorService,
} from "./campaign-director/campaignDirector.service";

export {
  default as creativeDirectorService,
} from "./creative-director/creativeDirector.service";

export {
  default as promptBuilderService,
} from "./prompt-builder/promptBuilder.service";

export * from "./types/campaign.types";

export * from "./visual-intelligence/visual.types";