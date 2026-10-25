import Zernio from "@zernio/node";

/**
 * Create the Zernio SDK only when a publishing operation is actually requested.
 * This keeps unrelated backend features (including signup/email verification)
 * available when Zernio is not configured in a given environment.
 */
function getZernioClient() {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    throw new Error("Zernio publishing is not configured: ZERNIO_API_KEY is missing.");
  }
  return new Zernio({ apiKey });
}

export class ZernioProvider {
  async createProfile(name: string) {
    const result = await getZernioClient().profiles.createProfile({
      body: { name },
    });
    console.log("Zernio createProfile:", JSON.stringify(result, null, 2));
    return result;
  }

  async publishMedia(params: {
    accountId: string;
    platform: "instagram" | "facebook";
    assetUrl: string;
    assetType: "image" | "video";
    caption: string;
  }) {
    return await getZernioClient().posts.createPost({
      body: {
        content: params.caption,
        publishNow: true,
        mediaItems: [{ url: params.assetUrl, type: params.assetType }],
        platforms: [{ platform: params.platform, accountId: params.accountId }],
      },
    });
  }

  async listAccounts(profileId: string) {
    const result = await getZernioClient().accounts.listAccounts({
      query: { profileId },
    });
    console.log("Zernio listAccounts:", JSON.stringify(result, null, 2));
    return result;
  }

  async getConnectUrl(
    platform: "instagram" | "facebook",
    profileId: string
  ) {
    return await getZernioClient().connect.getConnectUrl({
      path: { platform },
      query: {
        profileId,
        redirect_url: process.env.ZERNIO_REDIRECT_URL!,
      },
    });
  }

  async listProfiles() {
    const result = await getZernioClient().profiles.listProfiles();
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
}

export const zernioProvider = new ZernioProvider();
