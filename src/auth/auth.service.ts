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
const zernioProfile = await zernioProvider.createProfile(fullName);

// TEMP: log response
console.log("Zernio Profile Response:", zernioProfile);

// ------------------------------------------------
// Create Business Profile
// ------------------------------------------------
await tx.businessProfile.create({
  data: {
    userId: createdUser.id,
    zernioProfileId: zernioProfile.data.profile._id,
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
      passwordResetToken: resetToken,
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
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token.");
  }

  if (
    !user.passwordResetExpiresAt ||
    user.passwordResetExpiresAt < new Date()
  ) {
    throw new Error("Reset token has expired.");
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