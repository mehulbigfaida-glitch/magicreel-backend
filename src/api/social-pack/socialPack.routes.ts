import { Router } from "express";

import {
  generateSocialPack,
} from "./socialPack.controller";

import { authenticate } from "../../auth/jwt.middleware";

const router = Router();

router.post(
  "/generate",
  authenticate,
  generateSocialPack
);

export default router;