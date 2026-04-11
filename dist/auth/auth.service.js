"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../magicreel/db/prisma");
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
// ----------------------------
// Register User
// ----------------------------
async function registerUser(email, password) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    if (!prisma_1.prisma) {
        throw new Error("Database not initialized");
    }
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
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
async function loginUser(email, password) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    if (!prisma_1.prisma) {
        throw new Error("Database not initialized");
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        throw new Error("Invalid credentials");
    }
    return generateToken(user.id);
}
// ----------------------------
// JWT Generator
// ----------------------------
function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
