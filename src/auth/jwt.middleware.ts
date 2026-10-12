import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length).trim();
    } else if (typeof req.query.token === "string") {
      // Legacy browser redirect flow. Prefer Authorization headers for API calls.
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    // Decode is not authentication: verify signature and expiry before trusting the user ID.
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = decoded.id || decoded.userId;

    if (typeof userId !== "string" || !userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    (req as any).user = { id: userId };
    return next();
  } catch (error: any) {
    // Never log request headers or the supplied token.
    console.warn("JWT authentication failed:", error?.name ?? "Unauthorized");
    return res.status(401).json({ error: "Unauthorized" });
  }
}
