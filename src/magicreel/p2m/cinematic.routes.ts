import { Router } from "express";
import { billingGuard } from "../../billing/billing.middleware";
import { generateCinematicFrames } from "../../api/p2m/cinematic/generate-frames";
import { generateCinematicV1 } from "../../api/p2m/cinematic/generate-v1";

const router = Router();

router.post(
  "/generate-frames",
  billingGuard("CINEMATIC_LOOKBOOK"),
  generateCinematicFrames
);

router.post(
  "/generate-film",
  billingGuard("CINEMATIC_REEL"),
  generateCinematicV1
);

export default router;