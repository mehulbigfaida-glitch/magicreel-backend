import { Router } from "express";
import { authenticate } from "../auth/jwt.middleware";
import { socialController } from "./social.controller";

const router = Router();

router.get(
  "/connect/:platform",
  authenticate,
  socialController.connect.bind(
    socialController
  )
);

router.get(
  "/callback",
  socialController.callback.bind(
    socialController
  )
);

router.get(
  "/accounts",
  authenticate,
  socialController.accounts.bind(
    socialController
  )
);

export default router;