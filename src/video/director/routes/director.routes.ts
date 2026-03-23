// src/video/director/routes/director.routes.ts

import { Router } from "express";

const router = Router();

// Lazy-load controllers to avoid circular dependencies
const loadAudio = () =>
  require("../controller/directorAudio.controller");
const loadScenes = () =>
  require("../controller/directorSceneEngine.controller");
const loadFinal = () =>
  require("../controller/directorFinalAssembler.controller");
const loadFull = () =>
  require("../controller/directorFull.controller");

// --------------------------
// AUDIO ENGINE
// --------------------------
router.post("/voice", (req, res) =>
  loadAudio().createVoiceJob(req, res)
);

router.get("/voice/status/:jobId", (req, res) =>
  loadAudio().getVoiceJobStatus(req, res)
);

router.get("/voice/assets/:jobId", (req, res) =>
  loadAudio().getFinalVoiceAssets(req, res)
);

router.get("/voice/download/:jobId", (req, res) =>
  loadAudio().downloadFinalAudio(req, res)
);

// --------------------------
// SCENE ENGINE
// --------------------------
router.post("/scenes/generate", (req, res) =>
  loadScenes().generateDirectorScenes(req, res)
);

router.get("/scenes/status/:jobId", (req, res) =>
  loadScenes().getDirectorScenesStatus(req, res)
);

// --------------------------
// FINAL ASSEMBLY
// --------------------------
router.post("/final/assemble", (req, res) =>
  loadFinal().assembleFinalDirectorVideo(req, res)
);

router.get("/final/status/:jobId", (req, res) =>
  loadFinal().getFinalAssembleStatus(req, res)
);

// --------------------------
// FULL PIPELINE
// --------------------------
router.post("/full", (req, res) =>
  loadFull().runFullDirectorPipeline(req, res)
);

router.get("/full/status/:jobId", (req, res) =>
  loadFull().getFullDirectorPipelineStatus(req, res)
);

// Export the router properly
export default router;
