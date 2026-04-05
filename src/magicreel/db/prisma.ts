import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
  console.log("✅ Prisma initialized");
} catch (err) {
  console.warn("⚠️ Prisma failed - DB disabled");
  throw err; // ❗ MUST NOT CONTINUE WITHOUT DB
}

export default prisma; // ✅ FIX