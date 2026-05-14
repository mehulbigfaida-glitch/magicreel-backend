import { Router } from "express";
import { generateCreateAI } from "./createAI.controller";

const router = Router();

router.post(
  "/generate",
  generateCreateAI
);

export default router;