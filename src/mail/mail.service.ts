import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class MailService {
  static async sendEmail(
    to: string,
    subject: string,
    html: string
  ) {
    const result = await resend.emails.send({
      from: "MagicReel <admin@magicreel.in>",
      to,
      subject,
      html,
    });

    return result;
  }
}