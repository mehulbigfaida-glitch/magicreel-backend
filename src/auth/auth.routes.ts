import { Router } from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "./auth.controller";
import { authenticate } from "./jwt.middleware";
import rateLimit from "express-rate-limit";

const verificationLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false, message: { error: "Too many verification attempts. Please wait 15 minutes and try again." } });

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verificationLimiter, verifyEmail);
router.post("/resend-verification", verificationLimiter, resendVerification);

// ✅ Use new unified handler
router.get("/me", authenticate, getMe);

export default router;