import { Router } from "express";
import { getPredictions } from "./getPredictions";

const router = Router();

router.get("/", getPredictions);

export default router;