import { Router } from "express";
import { generateHeroV2 } from "./generate-v2";
import { pollHeroGeneration } from "./poll";

const router = Router();

/* ================= HERO GENERATION ================= */

router.post("/generate-v2", generateHeroV2);

/* ================= HERO STATUS ================= */

router.get("/status/:runId", pollHeroGeneration);

export default router;