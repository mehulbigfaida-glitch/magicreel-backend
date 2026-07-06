import { prisma } from "../magicreel/db/prisma";

/**
 * Expires subscriptions whose billing period has ended.
 *
 * This job is intended to run once every day.
 *
 * Responsibilities:
 * - Find expired subscriptions
 * - Set available credits to zero
 * - Leave all history intact
 */
export async function expireSubscriptionsJob() {
  try {
    const now = new Date();

    const result = await prisma.user.updateMany({
      where: {
        subscriptionEnd: {
          lt: now,
        },
        creditsAvailable: {
          gt: 0,
        },
      },
      data: {
        creditsAvailable: 0,
      },
    });

    console.log(
      `Subscription Cron: ${result.count} subscription(s) expired.`
    );

    return result.count;
  } catch (error) {
    console.error(
      "Subscription Cron Failed:",
      error
    );

    return 0;
  }
}