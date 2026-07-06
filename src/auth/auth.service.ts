import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../magicreel/db/prisma";
import { SubscriptionService } from "../subscription/subscription.service";

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
    // Create Empty Business Profile
    // ------------------------------------------------
    await tx.businessProfile.create({
  data: {
    userId: createdUser.id,
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