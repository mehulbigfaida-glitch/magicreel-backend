import { Router } from "express";
import { authenticate } from "../auth/jwt.middleware";

import {
  getProfile,
  updateProfile,
  updateLogo,
} from "./businessProfile.controller";

const router = Router();

/**
 * All Business Profile routes require authentication
 */
router.use(authenticate);

/**
 * GET Business Profile
 */
router.get("/", getProfile);

/**
 * Update Business Profile
 */
router.put("/", updateProfile);

/**
 * Update Business Logo
 *
 * (Currently accepts logoUrl.
 * Later this endpoint can be upgraded to
 * handle multipart/form-data + Cloudinary upload
 * without changing the frontend.)
 */
router.post("/logo", updateLogo);

export default router;