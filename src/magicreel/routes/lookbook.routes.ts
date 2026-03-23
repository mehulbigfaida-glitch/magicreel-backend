import { Router } from "express";
import { generateHeroImage } from "../controllers/lookbook.controller";

const router = Router();

router.post("/hero/generate", generateHeroImage);

export default router;
