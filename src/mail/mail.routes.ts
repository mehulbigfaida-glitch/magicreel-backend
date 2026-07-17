import { Router } from "express";
import { MailService } from "./mail.service";

const router = Router();

router.get("/test", async (_req, res) => {
  try {
    await MailService.sendEmail(
      "mehul.bigfaida@gmail.com",
      "MagicReel MailService Test",
      "<h2>MagicReel MailService is working ✅</h2>"
    );

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err,
    });
  }
});

export default router;