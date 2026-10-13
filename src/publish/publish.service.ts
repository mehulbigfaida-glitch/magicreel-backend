import { prisma } from "../magicreel/db/prisma";
import { zernioProvider } from "./providers/zernio.provider";
import { metaInstagramProvider } from "./providers/meta-instagram.provider";
import { decryptMetaToken } from "./providers/meta-token-crypto";

export class PublishService {
  async publish(params: {
    userId: string;
    platform: "instagram" | "facebook";
    assetUrl: string;
    assetType: "image" | "video";
    caption: string;
  }) {

      const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount =
      await prisma.publishPost.count({
        where: {
          userId: params.userId,
          createdAt: {
            gte: startOfDay,
          },
        },
      });

    const dailyLimit =
      user.plan === "ADVANCE"
        ? 5
        : 20;
    // Publishing is free for all users; no publishing subscription/payment gate.

if (todayCount >= dailyLimit) {

      console.warn(
  "DAILY_LIMIT_REACHED",
  {
    todayCount,
    dailyLimit,
    userId: params.userId,
    plan: user.plan,
  }
);

      throw new Error(
        "DAILY_LIMIT_REACHED"
      );
    }

    const account =
      await prisma.publishAccount.findFirst({
        where: {
          userId: params.userId,
          platform: params.platform,
          connected: true,
        },
      });

    if (!account) {
      throw new Error(
        "PLATFORM_NOT_CONNECTED"
      );
    }

      let providerPostId: string | null = null;

      if (params.platform === "instagram" && account.metaAccessToken && account.metaInstagramUserId) {
        const accessToken = decryptMetaToken(account.metaAccessToken);
        const result = await metaInstagramProvider.publishMedia({
          instagramUserId: account.metaInstagramUserId,
          accessToken,
          assetUrl: params.assetUrl,
          assetType: params.assetType,
          caption: params.caption,
        });
        providerPostId = result.id;
        console.info("META_INSTAGRAM_PUBLISH_SUCCEEDED", { userId: params.userId, postId: providerPostId });
      } else {
        if (!account.zernioAccountId) {
          throw new Error("PUBLISH_PROVIDER_ACCOUNT_MISSING");
        }
        const result = await zernioProvider.publishMedia({
          accountId: account.zernioAccountId,
          platform: params.platform,
          assetUrl: params.assetUrl,
          assetType: params.assetType,
          caption: params.caption,
        });
        providerPostId = result?.data?.post?._id ?? result?.postId ?? null;
        console.info("ZERNIO_PUBLISH_RESPONSE", {
          success: result?.success,
          postId: providerPostId,
          error: result?.error,
        });
      }

    const publishPost =
      await prisma.publishPost.create({
        data: {
          userId: params.userId,
          platform: params.platform,
          assetType: params.assetType,
          assetUrl: params.assetUrl,
          caption: params.caption,
          status: "PUBLISHED",
          zernioPostId: providerPostId,
        },
      });

    return publishPost;
  }
}

export const publishService =
  new PublishService();