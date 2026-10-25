import crypto from "crypto";
import { prisma } from "../magicreel/db/prisma";
import { MailService } from "../mail/mail.service";

const TOKEN_TTL_MS = 30 * 60 * 1000;
const FRONTEND_URL = (process.env.FRONTEND_URL || "https://magicreel.in").replace(/\/$/, "");

const PERSONAL_EMAIL_DOMAINS = new Set((
  "gmail.com,googlemail.com,yahoo.com,yahoo.co.in,yahoo.co.uk,ymail.com,rocketmail.com,hotmail.com,hotmail.co.uk,outlook.com,outlook.in,live.com,live.co.uk,msn.com,aol.com,icloud.com,me.com,mac.com,proton.me,protonmail.com,pm.me,tutanota.com,tuta.com,fastmail.com,gmx.com,gmx.net,mail.com,yandex.com,yandex.ru,inbox.com,zoho.com,rediffmail.com,rediff.com,hey.com,duck.com,privaterelay.appleid.com,qq.com,163.com,126.com,yeah.net,web.de,orange.fr,free.fr,laposte.net,btinternet.com,virginmedia.com,comcast.net,verizon.net,att.net,shaw.ca,hotmail.fr,outlook.fr,live.fr,hotmail.de,outlook.de,mail.ru,list.ru,bk.ru,internet.ru,dispostable.com,tempmail.com,guerrillamail.com,mailinator.com,10minutemail.com,yopmail.com,trashmail.com,sharklasers.com,throwawaymail.com,tempmailo.com,minuteinbox.com"
).split(","));

const extraPersonalDomains = () => (process.env.PERSONAL_EMAIL_DOMAINS || "")
  .split(",").map((d) => d.trim().toLowerCase()).filter(Boolean);

export function isCompanyEmail(email: string): boolean {
  const normalized = String(email || "").trim().toLowerCase();
  const match = normalized.match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/);
  if (!match) return false;
  const domain = match[1];
  const blocked = new Set([...PERSONAL_EMAIL_DOMAINS, ...extraPersonalDomains()]);
  return !blocked.has(domain) && !domain.startsWith("mail.") && !domain.endsWith(".tempmail");
}

function makeToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  return { raw, hash: crypto.createHash("sha256").update(raw).digest("hex") };
}

function verificationUrl(raw: string) {
  return `${FRONTEND_URL}/verify-email?token=${encodeURIComponent(raw)}`;
}

export async function sendUserVerification(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Account not found.");
  if (user.emailVerified) return;
  const token = makeToken();
  await prisma.user.update({ where: { id: userId }, data: {
    emailVerificationToken: token.hash,
    emailVerificationExpiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  }});
  const url = verificationUrl(token.raw);
  const result = await MailService.sendEmail(user.email, "Verify your MagicReel email address", `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#172033;line-height:1.6">
      <div style="background:#111827;color:#fff;padding:22px 28px;border-radius:14px 14px 0 0"><h2 style="margin:0">MagicReel</h2><p style="margin:4px 0 0;color:#cbd5e1">Fashion Intelligence Engine</p></div>
      <div style="padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 14px 14px">
        <h2>Verify your email</h2><p>Hello ${escapeHtml(user.fullName)},</p>
        <p>Please verify this email address to activate your MagicReel account.</p>
        <p><a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold">Verify email address</a></p>
        <p>This single-use link expires in 30 minutes. If you did not create a MagicReel account, you can ignore this email.</p>
      </div>
    </div>`);
  if (result.error) throw new Error("Verification email could not be sent. Please try again.");
}

export async function sendTestingRequestVerification(requestId: string) {
  const request = await prisma.testingCreditRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error("Testing-credit request not found.");
  const token = makeToken();
  await prisma.testingCreditRequest.update({ where: { id: requestId }, data: {
    emailVerified: false,
    emailVerificationToken: token.hash,
    emailVerificationExpiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  }});
  const url = verificationUrl(token.raw);
  const result = await MailService.sendEmail(request.email, "Verify your MagicReel business email", `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#172033;line-height:1.6">
      <div style="background:#111827;color:#fff;padding:22px 28px;border-radius:14px 14px 0 0"><h2 style="margin:0">MagicReel</h2><p style="margin:4px 0 0;color:#cbd5e1">Fashion Intelligence Engine</p></div>
      <div style="padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 14px 14px">
        <h2>Verify your business email</h2><p>Hello ${escapeHtml(request.name)},</p>
        <p>Confirm your company email address to submit your testing-credit request for review. Verification does not guarantee approval.</p>
        <p><a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold">Verify business email</a></p>
        <p>This single-use link expires in 30 minutes. If you did not request testing credits, you can ignore this email.</p>
      </div>
    </div>`);
  if (result.error) throw new Error("Verification email could not be sent. Please try again.");
}

export async function verifyEmailToken(rawToken: string) {
  if (!rawToken || rawToken.length > 200) throw new Error("Invalid or expired verification link.");
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const now = new Date();
  const user = await prisma.user.findFirst({ where: {
    emailVerificationToken: hash, emailVerificationExpiresAt: { gt: now },
  }});
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: {
      emailVerified: true, emailVerificationToken: null, emailVerificationExpiresAt: null,
    }});
    return { purpose: "signup" as const, email: user.email };
  }
  const request = await prisma.testingCreditRequest.findFirst({ where: {
    emailVerificationToken: hash, emailVerificationExpiresAt: { gt: now },
  }});
  if (request) {
    await prisma.testingCreditRequest.update({ where: { id: request.id }, data: {
      emailVerified: true, emailVerificationToken: null, emailVerificationExpiresAt: null,
    }});
    try {
      await MailService.sendEmail("mehul.bigfaida@gmail.com", "Verified MagicReel testing-credit request", `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222"><h2>Business email verified</h2>
        <p><strong>Name:</strong> ${escapeHtml(request.name)}</p><p><strong>Company:</strong> ${escapeHtml(request.company)}</p>
        <p><strong>Email:</strong> ${escapeHtml(request.email)}</p><p><strong>Request ID:</strong> ${request.id}</p>
        <p>The request is now ready for review in the admin panel.</p></div>`);
    } catch (e) { console.error("Admin verified-request notification failed", e); }
    return { purpose: "testing" as const, email: request.email };
  }
  throw new Error("Invalid, expired, or already-used verification link.");
}

export async function resendUserVerification(email: string) {
  const normalized = String(email || "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (user && !user.emailVerified) await sendUserVerification(user.id);
}

export async function resendTestingVerification(email: string) {
  const normalized = String(email || "").trim().toLowerCase();
  const request = await prisma.testingCreditRequest.findFirst({
    where: { email: normalized, emailVerified: false, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
  if (request) await sendTestingRequestVerification(request.id);
}

function escapeHtml(value: string) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c));
}
