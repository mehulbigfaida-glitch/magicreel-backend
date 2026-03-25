import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../magicreel/db/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// ----------------------------
// Register User
// ----------------------------
export async function registerUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!prisma) {
    throw new Error("Database not initialized");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      plan: "FREE",
      creditsAvailable: 1,
      freeHeroUsed: false
    }
  });

  return generateToken(user.id);
}

// ----------------------------
// Login User
// ----------------------------
export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (!prisma) {
    throw new Error("Database not initialized");
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

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
    { userId },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}