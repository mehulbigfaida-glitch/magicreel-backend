import { Router } from "express";

import {
  generateSocialPack,
} from "./socialPack.controller";

const router = Router();

router.post(
  "/generate",
  generateSocialPack
);

export default router;