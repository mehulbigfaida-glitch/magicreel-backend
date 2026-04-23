import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { prisma } from "../magicreel/db/prisma";

// ---------------- REGISTER ----------------
export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const token = await registerUser(email, password);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    res.json({ token, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// ---------------- LOGIN ----------------
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    res.json({ token, user });
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

    res.json({ user });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}