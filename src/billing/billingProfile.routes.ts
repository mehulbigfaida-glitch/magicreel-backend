import { Router } from "express";
import { authenticate } from "../auth/jwt.middleware";

import {
  getBilling,
  updateBilling,
} from "./billingProfile.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getBilling
);

router.put(
  "/",
  updateBilling
);

export default router;
