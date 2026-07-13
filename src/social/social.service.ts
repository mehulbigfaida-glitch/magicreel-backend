import { prisma } from "../magicreel/db/prisma";
import { zernioProvider } from "../publish/providers/zernio.provider";

export class SocialService {
  async syncAccounts(userId: string) {
    const businessProfile =
      await prisma.businessProfile.findUnique({
        where: {
          userId,
        },
      });

    if (!businessProfile?.zernioProfileId) {
      throw new Error("ZERNIO_PROFILE_NOT_FOUND");
    }

    const result =
      await zernioProvider.listAccounts(
        businessProfile.zernioProfileId
      );

    const accounts =
      result.data.accounts ?? [];

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
          connected:
            account.isActive &&
            account.platformStatus === "active",
          disconnectedAt:
            account.isActive &&
            account.platformStatus === "active"
              ? null
              : new Date(),
        },

        create: {
          userId,
          platform: account.platform,
          username: account.username,
          socialProfileId: account.profileId._id,
          zernioAccountId: account._id,
          connected:
            account.isActive &&
            account.platformStatus === "active",
        },
      });
    }

    return prisma.publishAccount.findMany({
      where: {
        userId,
        connected: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export const socialService =
  new SocialService();