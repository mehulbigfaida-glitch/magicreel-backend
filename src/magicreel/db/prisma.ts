import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

try {
  prisma = new PrismaClient();
  console.log("✅ Prisma initialized");
} catch (err) {
  console.warn("⚠️ Prisma failed - DB disabled");
}

export { prisma };