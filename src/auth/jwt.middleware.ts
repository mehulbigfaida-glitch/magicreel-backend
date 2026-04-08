import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {

    const authHeader = req.headers.authorization;

    // 🔥 NO TOKEN → allow (prevents crash in polling)
    if (!authHeader) {
      (req as any).user = null;
      return next();
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      (req as any).user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );

      (req as any).user = decoded;

      return next();

    } catch (err) {
      console.warn("Invalid token, continuing as guest");
      (req as any).user = null;
      return next();
    }

  } catch (error) {
    console.error("Auth middleware error:", error);

    // 🔥 NEVER BLOCK REQUEST
    (req as any).user = null;
    return next();
  }
}