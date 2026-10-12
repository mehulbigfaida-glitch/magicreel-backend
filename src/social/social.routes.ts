import { Router } from "express";
import { authenticate } from "../auth/jwt.middleware";
import { socialController } from "./social.controller";

const router = Router();

// Direct Meta OAuth initiation requires a valid MagicReel JWT.
// The OAuth callback is public by design; it is protected by one-time state
// validation and short-lived HttpOnly cookies created by the initiation route.
router.get(
  "/meta/connect",
  authenticate,
  socialController.connectMetaInstagram.bind(socialController)
);

router.get(
  "/meta/callback",
  socialController.callbackMetaInstagram.bind(socialController)
);

// Existing Zernio OAuth flow remains available as a recovery/rollback path.
router.get(
  "/connect/:platform",
  authenticate,
  socialController.connect.bind(socialController)
);

router.get(
  "/callback",
  socialController.callback.bind(socialController)
);

router.get(
  "/accounts",
  authenticate,
  socialController.accounts.bind(socialController)
);

export default router;
