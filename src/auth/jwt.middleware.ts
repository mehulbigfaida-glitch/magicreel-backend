import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../magicreel/db/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export interface AuthRequest extends Request {
  user?: any;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("❌ No auth header");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("❌ No token");
      return res.status(401).json({ error: "Invalid token format" });
    }

    // ================================
    // TRY SUPABASE TOKEN FIRST
    // ================================
    const decoded: any = jwt.decode(token);

    if (decoded && decoded.sub) {
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        source: "supabase",
      };

      console.log("✅ Supabase user:", req.user.id);
      return next();
    }

    // ================================
    // FALLBACK: OLD JWT SYSTEM
    // ================================
    try {
      const payload: any = jwt.verify(token, JWT_SECRET);

      if (!prisma) {
  console.log("❌ Prisma not initialized");
  return res.status(500).json({ error: "Server error" });
}

const user = await prisma.user.findUnique({
  where: { id: payload.userId },
});

      if (!user) {
        console.log("❌ User not found (old system)");
        return res.status(401).json({ error: "User not found" });
      }

      req.user = {
        ...user,
        source: "legacy",
      };

      console.log("⚠️ Legacy user:", user.id);

      return next();
    } catch (err) {
      console.log("❌ Both auth systems failed");
      return res.status(401).json({ error: "Invalid token" });
    }

  } catch (err) {
    console.log("❌ AUTH ERROR:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}