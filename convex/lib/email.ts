import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set in Convex environment");
  return new Resend(key);
}

const APP_URL = process.env.SITE_URL ?? "https://subsense.unbuilt.studio";

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

interface DigestSub {
  name: string;
  amount: number;
  currency: string;
  cycle: string;
  nextPaymentDate?: string;
}

interface DigestData {
  name: string;
  totalMonthly: number;
  currencySymbol: string;
  activeCount: number;
  upcoming: DigestSub[];
  overdue: DigestSub[];
}

export async function sendWeeklyDigestEmail(email: string, data: DigestData) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your weekly Subsense digest — ${data.currencySymbol}${data.totalMonthly.toFixed(2)}/mo`,
    html: weeklyDigestHtml(data),
  });
}

export async function sendPriceChangeEmail(
  email: string,
  name: string,
  serviceName: string,
  oldAmount: number,
  newAmount: number,
  currencySymbol: string
) {
  const resend = getResend();
  const direction = newAmount > oldAmount ? "increased" : "decreased";
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Price change detected — ${serviceName}`,
    html: priceChangeEmailHtml(
      name,
      serviceName,
      oldAmount,
      newAmount,
      currencySymbol,
      direction
    ),
  });
}

function weeklyDigestHtml(data: DigestData) {
  const { name, totalMonthly, currencySymbol, activeCount, upcoming, overdue } =
    data;

  const upcomingRows = upcoming
    .map((s) => {
      const due = s.nextPaymentDate
        ? new Date(s.nextPaymentDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "—";
      return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;font-size:13px;color:#f9fafb;font-weight:600">${s.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;font-size:13px;color:#9ca3af;text-align:right">${due}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1f1f1f;font-size:13px;color:#f9fafb;font-weight:700;text-align:right">${currencySymbol}${s.amount.toFixed(2)}</td>
      </tr>`;
    })
    .join("");

  const overdueSection =
    overdue.length > 0
      ? `
    <div style="margin:24px 0;padding:16px;background:rgba(249,112,102,0.1);border:1px solid rgba(249,112,102,0.2);border-radius:10px">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#f97066">Overdue</p>
      ${overdue.map((s) => `<p style="margin:4px 0;font-size:13px;color:#f9fafb;font-weight:600">${s.name} — ${currencySymbol}${s.amount.toFixed(2)}</p>`).join("")}
    </div>`
      : "";

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',system-ui,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#111;border:1px solid #1f1f1f;border-radius:16px;padding:40px">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">Subsense · Weekly Digest</p>
                <h1 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#f9fafb">Hi ${name} 👋</h1>
                <p style="margin:0 0 32px;font-size:14px;color:#9ca3af">Here's your subscription summary for the week.</p>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
                  <tr>
                    <td style="width:50%;padding-right:8px">
                      <div style="background:#1a1a1a;border:1px solid #1f1f1f;border-radius:10px;padding:16px">
                        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">Monthly Spend</p>
                        <p style="margin:0;font-size:22px;font-weight:900;color:#f9fafb">${currencySymbol}${totalMonthly.toFixed(2)}</p>
                      </div>
                    </td>
                    <td style="width:50%;padding-left:8px">
                      <div style="background:#1a1a1a;border:1px solid #1f1f1f;border-radius:10px;padding:16px">
                        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">Active</p>
                        <p style="margin:0;font-size:22px;font-weight:900;color:#f9fafb">${activeCount}</p>
                      </div>
                    </td>
                  </tr>
                </table>

                ${overdueSection}

                ${
                  upcoming.length > 0
                    ? `
                <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">Upcoming This Week</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
                  ${upcomingRows}
                </table>`
                    : `<p style="margin:0 0 32px;font-size:14px;color:#9ca3af">No renewals due in the next 7 days.</p>`
                }

                <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6">
                  You're receiving this because you enabled weekly digests in Subsense.<br/>
                  <a href="${APP_URL}/dashboard/settings" style="color:#7c3aed;text-decoration:none">Manage notification preferences</a>
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

function priceChangeEmailHtml(
  name: string,
  serviceName: string,
  oldAmount: number,
  newAmount: number,
  currencySymbol: string,
  direction: string
) {
  const color = direction === "increased" ? "#f97066" : "#2dd4bf";
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',system-ui,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#111;border:1px solid #1f1f1f;border-radius:16px;padding:40px">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">Subsense · Price Alert</p>
                <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#f9fafb">${serviceName} price ${direction}</h1>
                <p style="margin:0 0 32px;font-size:14px;color:#9ca3af;line-height:1.6">
                  Hi ${name}, we noticed the amount for <strong style="color:#f9fafb">${serviceName}</strong> was updated in your vault.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
                  <tr>
                    <td style="width:50%;padding-right:8px">
                      <div style="background:#1a1a1a;border:1px solid #1f1f1f;border-radius:10px;padding:16px;text-align:center">
                        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">Was</p>
                        <p style="margin:0;font-size:20px;font-weight:900;color:#6b7280;text-decoration:line-through">${currencySymbol}${oldAmount.toFixed(2)}</p>
                      </div>
                    </td>
                    <td style="width:50%;padding-left:8px">
                      <div style="background:#1a1a1a;border:1px solid ${color}40;border-radius:10px;padding:16px;text-align:center">
                        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${color}">Now</p>
                        <p style="margin:0;font-size:20px;font-weight:900;color:${color}">${currencySymbol}${newAmount.toFixed(2)}</p>
                      </div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6">
                  <a href="${APP_URL}/dashboard/settings" style="color:#7c3aed;text-decoration:none">Manage notification preferences</a>
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

export async function sendReminderEmail(
  email: string,
  userName: string,
  serviceName: string,
  amount: number,
  currencySymbol: string,
  cycle: string,
  daysUntil: number,
  renewalDate: string
) {
  const resend = getResend();
  const isOverdue = daysUntil < 0;
  const overdueDays = Math.abs(daysUntil);
  const dayLabel =
    daysUntil === -7
      ? "a week ago"
      : daysUntil === -1
        ? "yesterday"
        : daysUntil === 0
          ? "today"
          : daysUntil === 1
            ? "tomorrow"
            : `in ${daysUntil} days`;
  const overdueLabel = overdueDays === 7 ? "1 week ago" : "yesterday";
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: isOverdue
      ? `${serviceName} was due ${overdueLabel} — please review`
      : `${serviceName} renews ${dayLabel} — ${currencySymbol}${amount.toFixed(2)}`,
    html: reminderEmailHtml(
      userName,
      serviceName,
      amount,
      currencySymbol,
      cycle,
      dayLabel,
      renewalDate,
      isOverdue
    ),
  });
}

function reminderEmailHtml(
  name: string,
  serviceName: string,
  amount: number,
  currencySymbol: string,
  cycle: string,
  dayLabel: string,
  renewalDate: string,
  isOverdue: boolean
) {
  const badgeLabel = isOverdue
    ? "Subsense · Overdue"
    : "Subsense · Renewal Reminder";
  const heading = isOverdue ? `Action needed, ${name}` : `Heads up, ${name}`;
  const body = isOverdue
    ? `Your <strong style="color:#f9fafb">${serviceName}</strong> subscription was due <strong style="color:#f97066">${dayLabel}</strong>. Please review and update it.`
    : `Your <strong style="color:#f9fafb">${serviceName}</strong> subscription renews <strong style="color:#f9fafb">${dayLabel}</strong>.`;

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',system-ui,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#111;border:1px solid #1f1f1f;border-radius:16px;padding:40px">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6b7280">${badgeLabel}</p>
                <h1 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#f9fafb">${heading}</h1>
                <p style="margin:0 0 32px;font-size:14px;color:#9ca3af;line-height:1.6">
                  ${body}
                </p>
                <div style="background:#1a1a1a;border:1px solid #1f1f1f;border-radius:12px;padding:20px;margin-bottom:32px">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#9ca3af">Service</td>
                      <td style="font-size:13px;color:#f9fafb;font-weight:700;text-align:right">${serviceName}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#9ca3af;padding-top:10px">Amount</td>
                      <td style="font-size:13px;color:#f9fafb;font-weight:700;text-align:right;padding-top:10px">${currencySymbol}${amount.toFixed(2)} / ${cycle}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#9ca3af;padding-top:10px">Renewal date</td>
                      <td style="font-size:13px;color:#f9fafb;font-weight:700;text-align:right;padding-top:10px">${renewalDate}</td>
                    </tr>
                  </table>
                </div>
                <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6">
                  ${isOverdue ? "You're receiving this because this subscription is past its renewal date." : "You're receiving this because you enabled renewal reminders for this subscription."}<br/>
                  <a href="${APP_URL}/dashboard/settings" style="color:#7c3aed;text-decoration:none">Manage notification preferences</a>
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

export async function sendSupportEmail(
  fromName: string,
  fromEmail: string,
  subject: string,
  message: string
) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: "hello@unbuilt.studio",
    replyTo: fromEmail,
    subject: `[Support] ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0e0e13;color:#e8e8f0;border-radius:12px;">
        <h2 style="margin:0 0 24px;font-size:20px;color:#ffffff;">New Support Request</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:8px 0;color:#8888a0;font-size:13px;width:100px;">From</td><td style="padding:8px 0;font-size:13px;">${fromName} &lt;${fromEmail}&gt;</td></tr>
          <tr><td style="padding:8px 0;color:#8888a0;font-size:13px;">Subject</td><td style="padding:8px 0;font-size:13px;">${subject}</td></tr>
        </table>
        <div style="background:#1a1a2e;border-radius:8px;padding:20px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</div>
      </div>
    `,
  });
}
