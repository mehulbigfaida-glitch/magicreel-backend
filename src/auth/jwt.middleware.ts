import { Request, Response, NextFunction } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction) {

  try {

    const authHeader = req.headers.authorization;

    // 🔥 NO TOKEN → allow (critical for local)
    if (!authHeader) {
      (req as any).user = null;
      return next();
    }

    const token = authHeader.replace("Bearer ", "");

    // 🔥 EMPTY TOKEN → allow
    if (!token || token === "null" || token === "undefined") {
      (req as any).user = null;
      return next();
    }

    // 🔥 SKIP VERIFICATION (LOCAL DEBUG MODE)
    (req as any).user = { id: "dev-user" };

    return next();

  } catch (error) {

    console.warn("Auth bypass (dev mode)");

    (req as any).user = { id: "dev-user" };
    return next();
  }
}