import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../magicreel/db/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      console.log("❌ No auth header");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN:", token);

    const payload: any = jwt.verify(token, JWT_SECRET);
    console.log("PAYLOAD:", payload);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    console.log("USER:", user);

    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(401).json({ error: "User not found" });
    }

    (req as any).user = user;
    next();

  } catch (err) {
    console.log("❌ JWT ERROR:", err);
    res.status(401).json({ error: "Invalid token" });
  }
}