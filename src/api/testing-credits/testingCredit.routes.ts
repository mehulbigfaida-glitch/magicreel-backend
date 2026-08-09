import { Router } from "express";

import {
  requestTestingCredits,
} from "./testingCredit.controller";

const router = Router();

router.post(
  "/request",
  requestTestingCredits
);

export default router;