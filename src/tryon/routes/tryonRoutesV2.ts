import { Router } from "express";
import { TryOnControllerV2 } from "../controllers/tryonControllerV2";

const router = Router();
const controller = new TryOnControllerV2();

// 🔥 V2 namespace lives HERE
router.post("/v2/run", (req, res) => controller.run(req, res));
router.get("/v2/status/:jobId", (req, res) => controller.status(req, res));

export default router;
