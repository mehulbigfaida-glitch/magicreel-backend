import { prisma } from "../magicreel/db/prisma";
import { zernioProvider } from "../publish/providers/zernio.provider";

export class SocialService {
  async syncAccounts(userId: string) {
    const businessProfile = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    // Preserve legacy Zernio synchronization, but allow direct Meta accounts
    // to exist for users who do not have a Zernio profile.
    if (businessProfile?.zernioProfileId) {
      const result = await zernioProvider.listAccounts(businessProfile.zernioProfileId);
      const accounts = result.data.accounts ?? [];

      for (const account of accounts) {
        await prisma.publishAccount.upsert({
          where: {
            userId_platform: {
              userId,
              platform: account.platform,
            },
          },
          update: {
            username: account.username,
            socialProfileId: account.profileId._id,
            zernioAccountId: account._id,
            connected: account.isActive && account.platformStatus === "active",
            disconnectedAt:
              account.isActive && account.platformStatus === "active"
                ? null
                : new Date(),
          },
          create: {
            userId,
            platform: account.platform,
            username: account.username,
            socialProfileId: account.profileId._id,
            zernioAccountId: account._id,
            connected: account.isActive && account.platformStatus === "active",
          },
        });
      }
    }

    // Do not expose encrypted access tokens or provider IDs to the browser.
    return prisma.publishAccount.findMany({
      where: { userId, connected: true },
      select: {
        id: true,
        userId: true,
        platform: true,
        username: true,
        socialProfileId: true,
        connected: true,
        connectedAt: true,
        disconnectedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }
}

export const socialService = new SocialService();
