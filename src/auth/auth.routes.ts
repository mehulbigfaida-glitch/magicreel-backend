import { Router } from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from "./auth.controller";
import { authenticate } from "./jwt.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ✅ Use new unified handler
router.get("/me", authenticate, getMe);

export default router;