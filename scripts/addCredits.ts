import prisma from "../src/magicreel/db/prisma";

async function main() {
  try {

    const user = await prisma.user.update({
      where: {
        email: "test2@magicreel.com", // 👈 change if needed
      },
      data: {
        creditsAvailable: {
          increment: 50,   // 👈 adds 50 instead of overwriting
        },
      },
    });

    console.log("✅ Credits updated:", user.email);
    console.log("New credits:", user.creditsAvailable);

  } catch (err) {
    console.error("❌ Error updating credits:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();