import { Resend } from "resend";

export class MailService {
  private static getClient() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured.");
    }

    return new Resend(apiKey);
  }

  static async sendEmail(
    to: string,
    subject: string,
    html: string
  ) {
    const resend = MailService.getClient();

    const result = await resend.emails.send({
      from: "MagicReel <admin@magicreel.in>",
      to,
      subject,
      html,
    });

    return result;
  }
}