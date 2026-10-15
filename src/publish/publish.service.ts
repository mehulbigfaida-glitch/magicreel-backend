import { prisma } from "../magicreel/db/prisma";
import { zernioProvider } from "./providers/zernio.provider";
import { metaPublishService } from "./metaPublish.service";

export class PublishService {
  async publish(params: {
    userId: string;
    platform: "instagram" | "facebook";
    assetUrl: string;
    assetType: "image" | "video";
    caption: string;
  }) {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        plan: true,
        isPaid: true,
        subscriptionEnd: true,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Publishing requires an active MagicReel plan entitlement, not a separate
    // publishing subscription. Enterprise accounts may be administered without
    // a fixed subscription end date; all other paid plans require a future end.
    const now = new Date();
    const planIsActive =
      user.plan !== "FREE" &&
      ((!!user.subscriptionEnd && user.subscriptionEnd > now) ||
        (user.plan === "ENTERPRISE" && user.isPaid && !user.subscriptionEnd));

    if (!planIsActive) {
      throw new Error("ACTIVE_MAGICREEL_PLAN_REQUIRED");
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await prisma.publishPost.count({
      where: {
        userId: params.userId,
        createdAt: { gte: startOfDay },
      },
    });

    // Preserve the existing product limits; publishing itself is free.
    const dailyLimit = user.plan === "ADVANCE" ? 5 : 20;
    if (todayCount >= dailyLimit) {
      console.warn("DAILY_LIMIT_REACHED", {
        todayCount,
        dailyLimit,
        userId: params.userId,
        plan: user.plan,
      });
      throw new Error("DAILY_LIMIT_REACHED");
    }

    let providerPostId: string | null = null;

    if (params.platform === "instagram") {
      // Instagram is routed only through the dedicated Meta module.
      // Never silently retry through Zernio: that could create duplicate posts.
      const result = await metaPublishService.publish({
        userId: params.userId,
        assetUrl: params.assetUrl,
        assetType: params.assetType,
        caption: params.caption,
      });
      providerPostId = result.id;
    } else {
      // Keep the existing Facebook/Zernio path intact for compatibility.
      const account = await prisma.publishAccount.findFirst({
        where: {
          userId: params.userId,
          platform: params.platform,
          connected: true,
        },
        select: { zernioAccountId: true },
      });

      if (!account?.zernioAccountId) {
        throw new Error("PLATFORM_NOT_CONNECTED");
      }

      const result = await zernioProvider.publishMedia({
        accountId: account.zernioAccountId,
        platform: params.platform,
        assetUrl: params.assetUrl,
        assetType: params.assetType,
        caption: params.caption,
      });

      providerPostId =
        result?.data?.post?._id ?? result?.postId ?? null;
    }

    // Keep the existing DB field for provider post IDs to avoid a risky schema
    // rename/migration in this rollout. No credit deduction happens here.
    return prisma.publishPost.create({
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
  }
}

export const publishService = new PublishService();
