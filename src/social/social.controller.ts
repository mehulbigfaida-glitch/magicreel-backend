import { Request, Response } from "express";
import { randomBytes, timingSafeEqual } from "crypto";
import { prisma } from "../magicreel/db/prisma";
import { zernioProvider } from "../publish/providers/zernio.provider";
import { socialService } from "./social.service";
import { metaInstagramProvider } from "../publish/providers/meta-instagram.provider";
import { encryptMetaToken } from "../publish/providers/meta-token-crypto";

export class SocialController {
  async connectMetaInstagram(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

      const state = randomBytes(32).toString("hex");
      // The frontend and Railway API are on different sites. These cookies must
      // be sent on the cross-site fetch and survive Meta's redirect back to API.
      const cookieOptions = {
        httpOnly: true,
        sameSite: "none" as const,
        secure: true,
        maxAge: 10 * 60 * 1000,
        path: "/",
      };
      res.cookie("mr_meta_connect_user", userId, cookieOptions);
      res.cookie("mr_meta_connect_state", state, cookieOptions);
      return res.json({ success: true, authorizationUrl: metaInstagramProvider.getAuthorizationUrl(state) });
    } catch (error: any) {
      console.error("Meta Instagram connect initialization failed:", error?.message);
      return res.status(503).json({
        success: false,
        error: error?.message === "META_INSTAGRAM_CONFIGURATION_MISSING"
          ? "META_INSTAGRAM_CONFIGURATION_MISSING"
          : "META_INSTAGRAM_CONNECT_FAILED",
      });
    }
  }

  async callbackMetaInstagram(req: Request, res: Response) {
    const frontend = process.env.FRONTEND_URL || "https://www.magicreel.in";
    const clearCookies = () => {
      const options = { path: "/", sameSite: "none" as const, secure: true };
      res.clearCookie("mr_meta_connect_user", options);
      res.clearCookie("mr_meta_connect_state", options);
    };
    try {
      const userId = req.cookies?.mr_meta_connect_user;
      const expectedState = String(req.cookies?.mr_meta_connect_state ?? "");
      const returnedState = String(req.query.state ?? "");
      if (!userId || !expectedState || !returnedState) {
        clearCookies();
        return res.status(400).send("Instagram connection expired. Return to MagicReel and try again.");
      }
      const expected = Buffer.from(expectedState);
      const returned = Buffer.from(returnedState);
      if (expected.length !== returned.length || !timingSafeEqual(expected, returned)) {
        clearCookies();
        return res.status(400).send("Instagram authorization state did not match. Please try again.");
      }
      if (req.query.error || !req.query.code) {
        clearCookies();
        return res.redirect(`${frontend}/social-media?instagram=authorization_denied`);
      }

      const result = await metaInstagramProvider.exchangeCode(String(req.query.code));
      const encryptedToken = encryptMetaToken(result.accessToken);
      await prisma.publishAccount.upsert({
        where: { userId_platform: { userId, platform: "instagram" } },
        update: {
          username: result.username,
          socialProfileId: result.instagramUserId,
          metaInstagramUserId: result.instagramUserId,
          metaAccessToken: encryptedToken,
          connected: true,
          connectedAt: new Date(),
          disconnectedAt: null,
        },
        create: {
          userId,
          platform: "instagram",
          username: result.username,
          socialProfileId: result.instagramUserId,
          metaInstagramUserId: result.instagramUserId,
          metaAccessToken: encryptedToken,
          zernioAccountId: null,
          connected: true,
          connectedAt: new Date(),
        },
      });
      clearCookies();
      return res.redirect(`${frontend}/social-media?connected=instagram&provider=meta`);
    } catch (error: any) {
      console.error("Meta Instagram callback failed:", error?.response?.data ?? error?.message);
      clearCookies();
      return res.redirect(`${frontend}/social-media?instagram=connection_failed`);
    }
  }

  async connect(req: Request, res: Response) {
    try {
      const platform = req.params.platform as "instagram" | "facebook";
      const userId = (req as any).user.id;
      res.cookie("mr_connect", userId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 60 * 1000,
      });

      const businessProfile = await prisma.businessProfile.findUnique({ where: { userId } });
      if (!businessProfile?.zernioProfileId) {
        return res.status(400).json({ success: false, error: "ZERNIO_PROFILE_NOT_FOUND" });
      }

      const result = await zernioProvider.getConnectUrl(platform, businessProfile.zernioProfileId);
      return res.redirect(result.data.authUrl);
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error?.message ?? "CONNECT_FAILED" });
    }
  }

  async callback(req: Request, res: Response) {
    try {
      const userId = req.cookies.mr_connect;
      const platform = req.query.connected;
      const accountId = req.query.accountId;
      if (!platform || !accountId) {
        return res.status(400).json({ success: false, error: "INVALID_CALLBACK" });
      }
      if (!userId) {
        return res.status(401).json({ success: false, error: "CONNECT_COOKIE_MISSING" });
      }

      await socialService.syncAccounts(userId);
      res.clearCookie("mr_connect");
      return res.redirect(`${process.env.FRONTEND_URL}/social-media?connected=instagram`);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, error: error?.message });
    }
  }

  async accounts(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const accounts = await socialService.syncAccounts(userId);
      return res.json({ success: true, accounts });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error?.message });
    }
  }
}

export const socialController = new SocialController();
