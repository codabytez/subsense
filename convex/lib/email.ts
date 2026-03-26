import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set in Convex environment");
  return new Resend(key);
}

const FROM = "Subsense <noreply@unbuilt.studio>";

export async function sendVerificationEmail(
  email: string,
  name: string,
  url: string
) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your Subsense account",
    html: verificationEmailHtml(name, url),
  });
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  url: string
) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your Subsense password",
    html: passwordResetEmailHtml(name, url),
  });
}

function verificationEmailHtml(name: string, url: string) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',system-ui,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#111;border:1px solid #1f1f1f;border-radius:16px;padding:40px">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">Subsense</p>
                <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#f9fafb">Verify your email</h1>
                <p style="margin:0 0 32px;font-size:14px;color:#9ca3af;line-height:1.6">
                  Hi ${name}, click the button below to verify your email address and activate your account.
                </p>
                <a href="${url}" style="display:inline-block;background:#7c3aed;color:#fff;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;padding:14px 28px">
                  Verify email
                </a>
                <p style="margin:32px 0 0;font-size:12px;color:#6b7280;line-height:1.6">
                  If you didn't create a Subsense account, you can safely ignore this email.<br/>
                  This link expires in 24 hours.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function passwordResetEmailHtml(name: string, url: string) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',system-ui,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#111;border:1px solid #1f1f1f;border-radius:16px;padding:40px">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">Subsense</p>
                <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#f9fafb">Reset your password</h1>
                <p style="margin:0 0 32px;font-size:14px;color:#9ca3af;line-height:1.6">
                  Hi ${name}, click the button below to set a new password for your account.
                </p>
                <a href="${url}" style="display:inline-block;background:#7c3aed;color:#fff;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;padding:14px 28px">
                  Reset password
                </a>
                <p style="margin:32px 0 0;font-size:12px;color:#6b7280;line-height:1.6">
                  If you didn't request a password reset, you can safely ignore this email.<br/>
                  This link expires in 1 hour.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
