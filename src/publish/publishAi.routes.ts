import { Router } from "express";
import { generatePublishContent } from "./publishAi.controller";

const router = Router();

router.post(
  "/generate-content",
  generatePublishContent
);

export default router;