import { prisma } from "../magicreel/db/prisma";
import { metaInstagramProvider } from "./providers/meta-instagram.provider";
import { decryptMetaToken } from "./providers/meta-token-crypto";

/**
 * Direct Meta Instagram publishing path.
 * This module is deliberately separate from Zernio so provider selection is explicit.
 * It never falls back to another provider and never charges publishing credits.
 */
export class MetaPublishService {
  async publish(params: {
    userId: string;
    assetUrl: string;
    assetType: "image" | "video";
    caption: string;
  }) {
    const account = await prisma.publishAccount.findFirst({
      where: {
        userId: params.userId,
        platform: "instagram",
        connected: true,
      },
      select: {
        metaAccessToken: true,
        metaInstagramUserId: true,
      },
    });

    if (!account?.metaAccessToken || !account.metaInstagramUserId) {
      throw new Error("META_INSTAGRAM_NOT_CONNECTED");
    }

    const accessToken = decryptMetaToken(account.metaAccessToken);
    const result = await metaInstagramProvider.publishMedia({
      instagramUserId: account.metaInstagramUserId,
      accessToken,
      assetUrl: params.assetUrl,
      assetType: params.assetType,
      caption: params.caption,
    });

    console.info("META_INSTAGRAM_PUBLISH_SUCCEEDED", {
      userId: params.userId,
      postId: result.id,
    });

    return result;
  }
}

export const metaPublishService = new MetaPublishService();
