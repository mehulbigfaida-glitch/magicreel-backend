import { prisma } from "../magicreel/db/prisma";
import { zernioProvider } from "./providers/zernio.provider";

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

    if (
      user.plan !== "PRO" &&
      user.plan !== "ADVANCE"
    ) {
      throw new Error("PLAN_NOT_ALLOWED");
    }

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

      const result =
      await zernioProvider.publishMedia({
        accountId: account.zernioAccountId,
        platform: params.platform,
        assetUrl: params.assetUrl,
        assetType: params.assetType,
        caption: params.caption,
      });

    console.info(
  "ZERNIO RESULT:",
  {
    success: result?.success,
    postId: result?.postId,
    error: result?.error
  }
);

    const publishPost =
      await prisma.publishPost.create({
        data: {
          userId: params.userId,
          platform: params.platform,
          assetType: params.assetType,
          assetUrl: params.assetUrl,
          caption: params.caption,
          status: "PUBLISHED",
          zernioPostId:
            result?.data?.post?._id ?? null,
        },
      });

    return publishPost;
  }
}

export const publishService =
  new PublishService();