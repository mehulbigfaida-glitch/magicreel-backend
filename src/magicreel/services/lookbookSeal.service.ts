import prisma from "../db/prisma";

export async function sealLookbook(lookbookId: string) {
  const lookbook = await prisma.lookbook.findUnique({
    where: { id: lookbookId },
  });

  if (!lookbook) {
    throw new Error("Lookbook not found");
  }

  if (lookbook.status === "sealed") {
    return lookbook;
  }

  return prisma.lookbook.update({
    where: { id: lookbookId },
    data: { status: "sealed" },
  });
}
