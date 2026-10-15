import Zernio from "@zernio/node";

function getZernio() {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    throw new Error("ZERNIO_API_KEY is required for Zernio publishing.");
  }
  return new Zernio({ apiKey });
}

export class ZernioProvider {
  async createProfile(name: string) {
    const result = await getZernio().profiles.createProfile({
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
    return await getZernio().posts.createPost({
      body: {
        content: params.caption,
        publishNow: true,
        mediaItems: [{ url: params.assetUrl, type: params.assetType }],
        platforms: [{ platform: params.platform, accountId: params.accountId }],
      },
    });
  }

  async listAccounts(profileId: string) {
    const result = await getZernio().accounts.listAccounts({
      query: { profileId },
    });
    console.log("Zernio listAccounts:", JSON.stringify(result, null, 2));
    return result;
  }

  async getConnectUrl(
    platform: "instagram" | "facebook",
    profileId: string
  ) {
    return await getZernio().connect.getConnectUrl({
      path: { platform },
      query: {
        profileId,
        redirect_url: process.env.ZERNIO_REDIRECT_URL!,
      },
    });
  }

  async listProfiles() {
    const result = await getZernio().profiles.listProfiles();
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
}

export const zernioProvider = new ZernioProvider();
