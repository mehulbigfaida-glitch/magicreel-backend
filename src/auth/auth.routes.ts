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

router.post("/register", registerPending);
router.post("/register-pending", registerPending);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ✅ Use new unified handler
router.get("/me", authenticate, getMe);

export default router;