import { Router } from "express";

import { recommendEditorialWorld } from "./recommend";

const router = Router();

router.post(
  "/recommend",
  recommendEditorialWorld
);

export default router;