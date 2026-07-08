import { registerUser } from "../auth/auth.service";
import { prisma } from "../magicreel/db/prisma";
import { Plan, BillingCycle } from "@prisma/client";

const PASSWORD = "Magic@2026#Beta";

const USERS = [
  { fullName: "Jai", email: "jai123@magicreel.in" },
  { fullName: "Adhya", email: "adhya345@magicreel.in" },
  { fullName: "Shakti", email: "shakti567@magicreel.in" },
  { fullName: "Nipa", email: "nipa789@magicreel.in" },
  { fullName: "Shiva", email: "shiva910@magicreel.in" },
  { fullName: "Aarti", email: "aarti101@magicreel.in" },
  { fullName: "Swami", email: "swami010@magicreel.in" },
  { fullName: "Sukhi", email: "sukhi111@magicreel.in" },
  { fullName: "Shyama", email: "shyama112@magicreel.in" },
  { fullName: "Rama", email: "rama113@magicreel.in" },
];

async function main() {

  for (const user of USERS) {

    try {

      const existing = await prisma.user.findUnique({
  where: {
    email: user.email,
  },
});

if (existing) {
  console.log(`⏭️ Skipping ${user.email}`);
  continue;
}
      
      await registerUser({
        fullName: user.fullName,
        email: user.email,
        mobileNumber: "",
        password: PASSWORD,
      });

      await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          plan: Plan.PRO,
          creditsAvailable: 10,
          subscriptionType: BillingCycle.ANNUAL,
          subscriptionStart: new Date(),
          subscriptionEnd: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ),
        },
      });

      console.log(
        `✅ Created ${user.email}`
      );

    } catch (err: any) {

      console.log(
        `⚠️ ${user.email} : ${err.message}`
      );

    }

  }

  console.log("");
  console.log("==================================");
  console.log("Beta User Creation Complete");
  console.log("Password:", PASSWORD);
  console.log("==================================");

  process.exit(0);

}

main().catch(console.error);