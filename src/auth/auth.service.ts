import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../magicreel/db/prisma";
import { SubscriptionService } from "../subscription/subscription.service";
import { zernioProvider } from "../publish/providers/zernio.provider";
import { MailService } from "../mail/mail.service";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export interface RegisterUserInput {
  fullName: string;
  email: string;
  mobileNumber?: string;
  password: string;
  emailVerified?: boolean;
  skipZernioProfile?: boolean;
}

// ----------------------------
// Register User
// ----------------------------
export async function registerUser(
  input: RegisterUserInput
) {
  let {
    fullName,
    email,
    mobileNumber,
    password,
  } = input;

  fullName = fullName?.trim();
  email = email?.trim().toLowerCase();
  mobileNumber = mobileNumber?.trim();
  password = password?.trim();

  if (!fullName) {
    throw new Error("Full name is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    // ------------------------------------------------
    // Create User
    // ------------------------------------------------
    const createdUser = await tx.user.create({
      data: {
        fullName,
        mobileNumber,
        email,
        passwordHash,
        emailVerified: input.emailVerified ?? true,
      },
    });

    // ------------------------------------------------
    // Initialize FREE Subscription
    // (includes 1 Welcome Credit)
    // ------------------------------------------------
    await SubscriptionService.createFreeSubscription(
      createdUser.id,
      tx
    );

    // ------------------------------------------------
// Create Zernio Profile
// ------------------------------------------------
let zernioProfileId: string | null = null;
if (!input.skipZernioProfile) {
  const zernioProfile = await zernioProvider.createProfile(fullName);
  zernioProfileId = zernioProfile.data.profile._id;
  console.log("Zernio Profile Response:", zernioProfile);
}

// ------------------------------------------------
// Create Business Profile
// ------------------------------------------------
await tx.businessProfile.create({
  data: {
    userId: createdUser.id,
    zernioProfileId,
  },
});

// ------------------------------------------------
// Create Billing Profile (UserProfile)
// ------------------------------------------------
await tx.userProfile.create({
  data: {
    userId: createdUser.id,

    fullName: createdUser.fullName,

    companyName: null,

    addressLine1: null,
    addressLine2: null,

    city: null,
    state: null,
    postalCode: null,

    country: "India",

    gstin: null,

    phone: createdUser.mobileNumber,

    email: createdUser.email,
  },
});

    return createdUser;
  });

  return generateToken(user.id);
}

// ----------------------------
// Login User
// ----------------------------
export async function loginUser(
  email: string,
  password: string
) {
  email = email?.trim().toLowerCase();
  password = password?.trim();

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return generateToken(user.id);
}

// ----------------------------
// JWT Generator
// ----------------------------
function generateToken(userId: string) {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export async function forgotPassword(email: string) {
  
const users = await prisma.user.findMany({
  select: {
    email: true,
  },
});

const user = await prisma.user.findUnique({
  where: {
    email,
  },
});

  // Prevent email enumeration
  if (!user) {
    return {
      success: true,
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex"),
      passwordResetExpiresAt: expiresAt,
    },
  });

const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

console.log("📧 Sending password reset email to:", user.email);
console.log("🔗 Reset URL:", resetUrl);

try {
  const result = await MailService.sendEmail(
  user.email,
  "Reset your MagicReel password",
  `
    <h2>Reset your password</h2>

    <p>We received a request to reset your MagicReel password.</p>

    <p>
      <a href="${resetUrl}">
        Click here to reset your password
      </a>
    </p>

    <p>This link will expire in 30 minutes.</p>

    <p>If you didn't request this, you can safely ignore this email.</p>
  `
);

if (result.error) {
  console.error("❌ Resend error:", result.error);
  throw new Error(result.error.message);
}

console.log("✅ Password reset email sent successfully.");

} catch (err) {
  console.error("❌ Failed to send password reset email:", err);
  throw err;
}

  return {
  success: true,
};
}

export async function resetPassword(
  token: string,
  newPassword: string
) {
  // Hash the incoming token (matches Forgot Password storage)
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiresAt: null,
    },
  });

  return {
    success: true,
  };
}

// ----------------------------
// Email verification
// ----------------------------
function createVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  return { rawToken, tokenHash, expiresAt };
}

async function sendVerificationEmail(email: string, rawToken: string) {
  const frontendUrl = (process.env.EMAIL_VERIFICATION_FRONTEND_URL || process.env.FRONTEND_URL || "https://magicreel.in").replace(/\/$/, "");
  const verifyUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(rawToken)}`;
  const result = await MailService.sendEmail(
    email,
    "Verify your MagicReel email",
    `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
      <h1 style="color:#172554">Welcome to MagicReel</h1>
      <p>Please verify your email address to continue creating professional fashion content.</p>
      <p style="margin:28px 0"><a href="${verifyUrl}" style="background:#172554;color:#fff;text-decoration:none;padding:14px 22px;border-radius:8px;display:inline-block;font-weight:bold">Verify email</a></p>
      <p>This link can be used once and expires in 30 minutes.</p>
      <p>If you did not request a MagicReel account, you can ignore this email.</p>
    </div>`
  );
  if (result.error) throw new Error("Verification email could not be sent. Please try again.");
}

export async function registerPendingUser(input: RegisterUserInput) {
  const email = input.email?.trim().toLowerCase();
  if (!email || !input.password) throw new Error("Email and password are required.");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.emailVerified) {
      const { rawToken, tokenHash, expiresAt } = createVerificationToken();
      await prisma.user.update({
        where: { id: existing.id },
        data: { emailVerificationToken: tokenHash, emailVerificationExpiresAt: expiresAt },
      });
      await sendVerificationEmail(email, rawToken);
      return { success: true };
    }
    throw new Error("An account already exists for this email. Please log in.");
  }

  // Reuse the established account, subscription and profile creation path.
  const fullName = input.fullName?.trim() || email.split("@")[0] || "MagicReel User";
  await registerUser({ ...input, fullName, email, emailVerified: false, skipZernioProfile: true });
  const { rawToken, tokenHash, expiresAt } = createVerificationToken();
  await prisma.user.update({
    where: { email },
    data: { emailVerified: false, emailVerificationToken: tokenHash, emailVerificationExpiresAt: expiresAt },
  });
  await sendVerificationEmail(email, rawToken);
  return { success: true };
}

export async function verifyUserEmail(rawToken: string) {
  if (!rawToken) throw new Error("Verification token is required.");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const now = new Date();
  const found = await prisma.user.findFirst({
    where: { emailVerificationToken: tokenHash, emailVerificationExpiresAt: { gt: now }, emailVerified: false },
    select: { id: true },
  });
  if (!found) throw new Error("This verification link is invalid, expired, or already used.");
  const updated = await prisma.user.updateMany({
    where: { id: found.id, emailVerificationToken: tokenHash, emailVerificationExpiresAt: { gt: now }, emailVerified: false },
    data: { emailVerified: true, emailVerificationToken: null, emailVerificationExpiresAt: null },
  });
  if (updated.count !== 1) throw new Error("This verification link is invalid, expired, or already used.");
  return { success: true, token: generateToken(found.id), userId: found.id };
}

export async function resendUserVerification(emailInput: string) {
  const email = emailInput?.trim().toLowerCase();
  if (!email) throw new Error("Email is required.");
  const user = await prisma.user.findUnique({ where: { email } });
  // Same generic response avoids revealing whether an address is registered.
  if (!user || user.emailVerified) return { success: true };
  const { rawToken, tokenHash, expiresAt } = createVerificationToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken: tokenHash, emailVerificationExpiresAt: expiresAt },
  });
  await sendVerificationEmail(email, rawToken);
  return { success: true };
}
