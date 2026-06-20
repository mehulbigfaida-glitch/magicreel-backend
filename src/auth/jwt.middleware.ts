import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        error: "No token",
      });
    }

    const token =
  authHeader.split(" ")[1];

// TEMP DEBUG
const decoded: any =
  jwt.decode(token);

const userId =
  decoded?.id ||
  decoded?.userId;

if (!userId) {
  return res.status(401).json({
    error: "Invalid token payload",
  });
}

(req as any).user = {
  id: userId,
};

return next();

  } catch (error: any) {

    console.error(
      "JWT VERIFY ERROR:",
      error?.message
    );

    return res.status(401).json({
      error: "Unauthorized",
    });

  }
}