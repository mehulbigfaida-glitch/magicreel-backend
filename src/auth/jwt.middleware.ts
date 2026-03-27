import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../magicreel/db/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    if (!prisma) {
      return res.status(500).json({ error: "Prisma not initialized" });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const payload: any = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    (req as any).user = user;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}