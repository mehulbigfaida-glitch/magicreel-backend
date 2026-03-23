import { Router } from "express";
import { generateTryOn } from "../controllers/tryonController";

const router = Router();

router.post("/", generateTryOn);

export default router;
