import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // ✅ BYPASS ONLY FOR TEST ROUTE
    if (req.originalUrl.includes("/test-queue")) {
  return next();
}

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // ✅ normalize user object
    (req as any).user = {
      ...decoded,
      id: decoded.userId || decoded.id,
      userId: decoded.userId || decoded.id,
    };

    return next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}