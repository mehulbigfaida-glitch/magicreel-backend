import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from "./auth.service";
import { prisma } from "../magicreel/db/prisma";
import { verifyEmailToken, resendUserVerification, resendTestingVerification, isCompanyEmail } from "./email-verification.service";

// ---------------- REGISTER ----------------
export async function register(req: Request, res: Response) {
  try {
    const {
  fullName,
  email,
  mobileNumber,
  password,
} = req.body;

    // ✅ Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // ✅ Create user + get token
    const registration = await registerUser({
  fullName,
  email,
  mobileNumber,
  password,
});

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(500).json({ error: "User creation failed" });
    }

    // ✅ Remove sensitive fields
    const { passwordHash, ...safeUser } = user as any;

    // ✅ SAME RESPONSE SHAPE AS LOGIN
    res.json({
      token,
      user: safeUser,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// ---------------- LOGIN ----------------
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // ✅ Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const token = await loginUser(email, password);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Remove sensitive fields
    const { passwordHash, ...safeUser } = user as any;

    res.json({
      token,
      user: safeUser,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// ---------------- GET ME ----------------
export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const { passwordHash, ...safeUser } = user as any;

    res.json({ user: safeUser });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

// ---------------- FORGOT PASSWORD ----------------
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    await forgotPasswordService(email);

    return res.json({
      success: true,
      message: "If an account exists for this email, a password reset link will be sent.",
    });
  } catch (err: any) {
    return res.status(400).json({
      error: err.message,
    });
  }
}

// ---------------- RESET PASSWORD ----------------
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        error: "Token and password are required",
      });
    }

    await resetPasswordService(token, password);

    return res.json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (err: any) {
    return res.status(400).json({
      error: err.message,
    });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.body;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, error: "Verification token is required." });
    }
    const result = await verifyEmailToken(token);
    return res.json({
      success: true,
      purpose: result.purpose,
      email: result.email,
      message: result.purpose === "signup"
        ? "Email verified. You can now sign in to MagicReel."
        : "Business email verified. Your testing-credit request is ready for review.",
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err?.message || "Unable to verify email." });
  }
}

export async function resendVerification(req: Request, res: Response) {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const purpose = req.body?.purpose === "testing" ? "testing" : "signup";
    if (!email) return res.status(400).json({ success: false, error: "Email is required." });
    if (purpose === "testing" && !isCompanyEmail(email)) {
      return res.status(400).json({ success: false, error: "Please use a company email address for testing-credit requests." });
    }
    if (purpose === "testing") await resendTestingVerification(email);
    else await resendUserVerification(email);
    return res.json({ success: true, message: "If the request can be verified, a fresh verification email has been sent." });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err?.message || "Unable to resend verification email." });
  }
}
