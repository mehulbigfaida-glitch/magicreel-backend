import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  registerPending,
  verifyEmail,
  resendVerification,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from "./auth.controller";
import { authenticate } from "./jwt.middleware";

const router = Router();
const signupLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false, message: { error: "Too many signup attempts. Please try again in 15 minutes." } });
const verificationLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: "Too many verification attempts. Please try again later." } });
const resendLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 3, standardHeaders: true, legacyHeaders: false, message: { error: "Too many resend requests. Please try again later." } });

// All new registrations must verify email before login.
router.post("/register", signupLimiter, registerPending);
router.post("/register-pending", signupLimiter, registerPending);
router.post("/verify-email", verificationLimiter, verifyEmail);
router.post("/resend-verification", resendLimiter, resendVerification);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getMe);

export default router;
