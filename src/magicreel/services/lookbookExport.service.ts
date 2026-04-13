import { prisma } from "../db/prisma";

export async function exportLookbookReel(lookbookId: string) {
  const lookbook = await prisma.lookbook.findUnique({
    where: { id: lookbookId },
    include: { renders: true },
  });

  if (!lookbook) {
    throw new Error("Lookbook not found");
  }

  if (lookbook.status !== "sealed") {
    throw new Error("Lookbook must be sealed before export");
  }

  // 🔒 V1: trigger-only export (video pipeline already exists)
  return {
    lookbookId: lookbook.id,
    status: "export-queued",
  };
}
