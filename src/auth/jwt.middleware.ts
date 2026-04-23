import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // ✅ BYPASS FOR TEST ROUTE
    const url = (req as any).originalUrl || "";

    if (
      url.includes("/api/test-queue") ||
      url.includes("/test-queue")
    ) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // 🚨 STRICT NORMALIZATION
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // ✅ FINAL STRUCTURE (LOCKED)
    (req as any).user = {
      id: userId,
    };

    return next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}