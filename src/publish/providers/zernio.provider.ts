import Zernio from "@zernio/node";

const zernio = new Zernio({
  apiKey: process.env.ZERNIO_API_KEY,
});

export class ZernioProvider {
  async publishMedia(params: {
    accountId: string;
    platform: "instagram" | "facebook";
    assetUrl: string;
    assetType: "image" | "video";
    caption: string;
  }) {
    const result = await zernio.posts.createPost({
      body: {
        content: params.caption,

        publishNow: true,

        mediaItems: [
          {
            url: params.assetUrl,
            type: params.assetType,
          },
        ],

        platforms: [
          {
            platform: params.platform,
            accountId: params.accountId,
          },
        ],
      },
    });

    return result;
  }

  async listAccounts() {
    const result =
      await zernio.accounts.listAccounts();

    return result;
  }
}

export const zernioProvider =
  new ZernioProvider();