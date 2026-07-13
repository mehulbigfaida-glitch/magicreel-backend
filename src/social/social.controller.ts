import { Request, Response } from "express";
import { prisma } from "../magicreel/db/prisma";
import { zernioProvider } from "../publish/providers/zernio.provider";
import { socialService } from "./social.service";

export class SocialController {
  async connect(
    req: Request,
    res: Response
  ) {
    try {
      const platform =
        req.params.platform as
          | "instagram"
          | "facebook";

      const userId = (req as any).user.id;

res.cookie("mr_connect", userId, {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 10 * 60 * 1000, // 10 minutes
});
      
          const businessProfile =
  await prisma.businessProfile.findUnique({
    where: {
      userId,
    },
  });

if (!businessProfile?.zernioProfileId) {
  return res.status(400).json({
    success: false,
    error: "ZERNIO_PROFILE_NOT_FOUND",
  });
}

const result =
  await zernioProvider.getConnectUrl(
    platform,
    businessProfile.zernioProfileId
  );

      return res.redirect(
        result.data.authUrl
      );

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        error:
          error?.message ??
          "CONNECT_FAILED",
      });

    }
  }

   async callback(
    req: Request,
    res: Response
  ) {
    try {

      const userId = req.cookies.mr_connect;

      const platform = req.query.connected;

const accountId = req.query.accountId;

if (!platform || !accountId) {
  return res.status(400).json({
    success: false,
    error: "INVALID_CALLBACK",
  });
}
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "CONNECT_COOKIE_MISSING",
        });
      }

      await socialService.syncAccounts(userId);

res.clearCookie("mr_connect");

return res.redirect(
  `${process.env.FRONTEND_URL}/social-media?connected=instagram`
);

    } catch (error: any) {

      console.error(error);

      return res.status(500).json({
        success: false,
        error: error?.message,
      });

    }
    }

  async accounts(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user.id;

const accounts =
  await socialService.syncAccounts(userId);

return res.json({
  success: true,
  accounts,
});

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      error: error?.message,
    });

  }
}

}

export const socialController =
  new SocialController();