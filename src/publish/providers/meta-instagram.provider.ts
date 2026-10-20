import axios from "axios";

/**
 * Direct Instagram publishing using Meta's Instagram Login API.
 *
 * Required configuration:
 * - META_INSTAGRAM_APP_ID
 * - META_INSTAGRAM_APP_SECRET
 * - META_INSTAGRAM_REDIRECT_URI (must exactly match Meta app settings)
 *
 * Only Instagram professional accounts that have granted the required
 * permissions can publish. Media URLs must be publicly reachable by Meta.
 */
const GRAPH_BASE = "https://graph.instagram.com";

export class MetaInstagramProvider {
  getAuthorizationUrl(state: string): string {
    const appId = process.env.META_INSTAGRAM_APP_ID;
    const redirectUri = process.env.META_INSTAGRAM_REDIRECT_URI;

    if (!appId || !redirectUri) {
      throw new Error("META_INSTAGRAM_CONFIGURATION_MISSING");
    }

    const url = new URL("https://www.instagram.com/oauth/authorize");
    url.searchParams.set("client_id", appId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set(
      "scope",
      "instagram_business_basic,instagram_business_content_publish"
    );
    url.searchParams.set("state", state);
    return url.toString();
  }

  async exchangeCode(code: string): Promise<{
    accessToken: string;
    instagramUserId: string;
    username: string | null;
  }> {
    const appId = process.env.META_INSTAGRAM_APP_ID;
    const appSecret = process.env.META_INSTAGRAM_APP_SECRET;
    const redirectUri = process.env.META_INSTAGRAM_REDIRECT_URI;
    if (!appId || !appSecret || !redirectUri) {
      throw new Error("META_INSTAGRAM_CONFIGURATION_MISSING");
    }

    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 15000 }
    );

    const shortLivedToken = tokenResponse.data?.access_token;
    const userId = String(tokenResponse.data?.user_id ?? "");
    if (!shortLivedToken || !userId) {
      throw new Error("META_INSTAGRAM_TOKEN_EXCHANGE_FAILED");
    }

    const longTokenResponse = await axios.get(`${GRAPH_BASE}/access_token`, {
      params: {
        grant_type: "ig_exchange_token",
        client_secret: appSecret,
        access_token: shortLivedToken,
      },
      timeout: 15000,
    });
    const accessToken = longTokenResponse.data?.access_token;
    if (!accessToken) throw new Error("META_INSTAGRAM_LONG_LIVED_TOKEN_FAILED");

    const profileResponse = await axios.get(`${GRAPH_BASE}/me`, {
      params: { fields: "user_id,username", access_token: accessToken },
      timeout: 15000,
    });

    return {
      accessToken,
      instagramUserId: String(profileResponse.data?.user_id ?? userId),
      username: profileResponse.data?.username ?? null,
    };
  }

  async publishMedia(params: {
    instagramUserId: string;
    accessToken: string;
    assetUrl: string;
    assetType: "image" | "video";
    caption: string;
  }): Promise<{ id: string }> {
    if (!/^https:\/\//i.test(params.assetUrl)) {
      throw new Error("INSTAGRAM_MEDIA_URL_MUST_BE_PUBLIC_HTTPS");
    }

    const isVideo = params.assetType === "video";
    const container = await axios.post(
      `${GRAPH_BASE}/${encodeURIComponent(params.instagramUserId)}/media`,
      null,
      {
        params: {
          ...(isVideo
            ? { video_url: params.assetUrl, media_type: "REELS" }
            : { image_url: params.assetUrl }),
          caption: params.caption,
          access_token: params.accessToken,
        },
        timeout: 20000,
      }
    );

    const creationId = container.data?.id;
    if (!creationId) throw new Error("INSTAGRAM_MEDIA_CONTAINER_FAILED");

    // Instagram processes media asynchronously. Wait for both image and video
    // containers to be ready before calling media_publish; publishing too early
    // can return HTTP 400 even though container creation succeeded.
    let ready = false;
    let lastStatus = "IN_PROGRESS";
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const status = await axios.get(`${GRAPH_BASE}/${creationId}`, {
        params: { fields: "status_code", access_token: params.accessToken },
        timeout: 15000,
      });
      lastStatus = String(status.data?.status_code ?? "IN_PROGRESS");
      if (lastStatus === "FINISHED") {
        ready = true;
        break;
      }
      if (lastStatus === "ERROR" || lastStatus === "EXPIRED") {
        throw new Error(`INSTAGRAM_MEDIA_PROCESSING_FAILED:${lastStatus}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    if (!ready) {
      throw new Error(`INSTAGRAM_MEDIA_PROCESSING_TIMEOUT:${lastStatus}`);
    }

    try {
      const published = await axios.post(
        `${GRAPH_BASE}/${encodeURIComponent(params.instagramUserId)}/media_publish`,
        null,
        {
          params: { creation_id: creationId, access_token: params.accessToken },
          timeout: 20000,
        }
      );
      const id = published.data?.id;
      if (!id) throw new Error("INSTAGRAM_PUBLISH_FAILED");
      return { id: String(id) };
    } catch (error: any) {
      // Surface Meta's actionable error without logging request config, which
      // contains the access token in the query string.
      const metaError = error?.response?.data?.error;
      if (metaError) {
        console.error("Instagram media_publish rejected request", {
          code: metaError.code,
          subcode: metaError.error_subcode,
          type: metaError.type,
          message: metaError.message,
          fbtrace_id: metaError.fbtrace_id,
        });
        throw new Error(
          `INSTAGRAM_MEDIA_PUBLISH_REJECTED:${metaError.code ?? "unknown"}:${metaError.message ?? "Meta rejected the publish request"}`
        );
      }
      console.error("Instagram media_publish request failed", {
        message: error?.message ?? "Unknown request error",
        status: error?.response?.status,
      });
      throw new Error("INSTAGRAM_MEDIA_PUBLISH_REQUEST_FAILED");
    }
  }
}

export const metaInstagramProvider = new MetaInstagramProvider();
