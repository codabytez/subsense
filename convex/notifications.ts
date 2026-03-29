import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { sendWeeklyDigestEmail } from "./lib/email";

function intervalToDays(interval: string): number | null {
  const m = interval.match(/^(\d+)(d|w)$/);
  if (!m) return null;
  return parseInt(m[1]) * (m[2] === "w" ? 7 : 1);
}

const SYMBOL_MAP: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$",
  CHF: "Fr",
  NGN: "₦",
  INR: "₹",
  CNY: "¥",
};

function currencySymbol(code: string) {
  return SYMBOL_MAP[code] ?? code;
}

// ── Internal queries ───────────────────────────────────────────

export const getUsersForDigest = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<"users">[]> => {
    const all = await ctx.db.query("users").collect();
    return all.filter((u) => u.notifEmailDigest === true && !u.notifMuteAll);
  },
});

export const getSubsForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }): Promise<Doc<"subscriptions">[]> => {
    return ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getSubsForReminders = internalQuery({
  args: {},
  handler: async (
    ctx
  ): Promise<
    Array<{
      sub: Doc<"subscriptions">;
      userEmail: string;
      userName: string;
      userCurrency: string;
      daysUntil: number;
    }>
  > => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const allSubs = await ctx.db.query("subscriptions").collect();

    const matches: Array<{
      sub: Doc<"subscriptions">;
      userEmail: string;
      userName: string;
      userCurrency: string;
      daysUntil: number;
    }> = [];

    for (const sub of allSubs) {
      if (
        sub.status === "cancelled" ||
        sub.status === "paused" ||
        sub.status === "lapsed"
      )
        continue;
      if (!sub.nextPaymentDate) continue;

      const due = new Date(sub.nextPaymentDate);
      due.setUTCHours(0, 0, 0, 0);
      const msPerDay = 86_400_000;
      const daysUntil = Math.round(
        (due.getTime() - today.getTime()) / msPerDay
      );

      // Due today — notify everyone regardless of reminder preferences.
      // NOTE: when auto-payment processing is implemented, this cron must run
      // before the payment is marked paid so the email goes out first.
      const isDueToday = daysUntil === 0;

      // Overdue — fires at 1 day and 1 week past the due date (recurring only).
      const isOverdue =
        sub.cycle !== "one-off" && (daysUntil === -1 || daysUntil === -7);

      // Advance reminder — only if the user opted in and the interval matches.
      const isAdvanceReminder =
        daysUntil > 0 &&
        sub.remindersEnabled &&
        sub.reminderIntervals.some(
          (interval) => intervalToDays(interval) === daysUntil
        );

      if (!isDueToday && !isOverdue && !isAdvanceReminder) continue;

      const user = await ctx.db.get(sub.userId);
      if (!user || user.notifMuteAll) continue;

      matches.push({
        sub,
        userEmail: user.email,
        userName: user.name,
        userCurrency: user.currency ?? "USD",
        daysUntil,
      });
    }

    return matches;
  },
});

// ── Price change action ────────────────────────────────────────

export const sendPriceChangeNotification = internalAction({
  args: {
    userId: v.id("users"),
    subscriptionId: v.id("subscriptions"),
    email: v.string(),
    name: v.string(),
    serviceName: v.string(),
    oldAmount: v.number(),
    newAmount: v.number(),
    currency: v.string(),
  },
  handler: async (
    ctx,
    {
      userId,
      subscriptionId,
      email,
      name,
      serviceName,
      oldAmount,
      newAmount,
      currency,
    }
  ) => {
    const { sendPriceChangeEmail } = await import("./lib/email");
    await sendPriceChangeEmail(
      email,
      name,
      serviceName,
      oldAmount,
      newAmount,
      currencySymbol(currency)
    );
    const direction = newAmount > oldAmount ? "increased" : "decreased";
    const sym = currencySymbol(currency);
    await ctx.runMutation(internal.inbox.createNotification, {
      userId,
      type: "price_change",
      title: `${serviceName} price ${direction}`,
      message: `${sym}${oldAmount.toFixed(2)} → ${sym}${newAmount.toFixed(2)}`,
      subscriptionId,
      link: `/dashboard/subscriptions/${subscriptionId}`,
    });
  },
});

// ── Subscription reminder action ───────────────────────────────

export const sendSubscriptionReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    const matches = await ctx.runQuery(
      internal.notifications.getSubsForReminders
    );

    const { sendReminderEmail } = await import("./lib/email");

    for (const {
      sub,
      userEmail,
      userName,
      userCurrency,
      daysUntil,
    } of matches) {
      const symbol = currencySymbol(sub.currency ?? userCurrency);
      const renewalDate = new Date(sub.nextPaymentDate!).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
      );
      await sendReminderEmail(
        userEmail,
        userName,
        sub.name,
        sub.amount,
        symbol,
        sub.cycle,
        daysUntil,
        renewalDate
      );

      const isOverdue = daysUntil < 0;
      const isOneOff = sub.cycle === "one-off";
      const notifType = isOverdue ? "overdue" : "reminder";
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

      const title = isOneOff
        ? daysUntil === 0
          ? `${sub.name} expires today`
          : `${sub.name} expires ${dayLabel}`
        : isOverdue
          ? `${sub.name} is overdue`
          : `${sub.name} renews ${dayLabel}`;

      await ctx.runMutation(internal.inbox.createNotification, {
        userId: sub.userId,
        type: notifType,
        title,
        message: `${symbol}${sub.amount.toFixed(2)} · ${renewalDate}`,
        subscriptionId: sub._id,
        link: `/dashboard/subscriptions/${sub._id}`,
      });
    }
  },
});

// ── Weekly digest action ───────────────────────────────────────

export const sendWeeklyDigests = internalAction({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery(internal.notifications.getUsersForDigest);

    for (const user of users) {
      const subs = await ctx.runQuery(internal.notifications.getSubsForUser, {
        userId: user._id as Id<"users">,
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const in7Days = new Date(today);
      in7Days.setDate(today.getDate() + 7);

      const active = subs.filter(
        (s: Doc<"subscriptions">) =>
          s.status !== "paused" &&
          s.status !== "cancelled" &&
          s.status !== "lapsed"
      );
      const activeCount = subs.filter(
        (s: Doc<"subscriptions">) => s.status === "active"
      ).length;

      const totalMonthly = active.reduce(
        (sum: number, s: Doc<"subscriptions">) => {
          if (s.cycle === "one-off") return sum;
          if (s.cycle === "annual") return sum + s.amount / 12;
          if (s.cycle === "weekly") return sum + s.amount * 4.33;
          return sum + s.amount;
        },
        0
      );

      const upcoming = active.filter((s: Doc<"subscriptions">) => {
        if (s.cycle === "one-off") return false;
        if (!s.nextPaymentDate) return false;
        const due = new Date(s.nextPaymentDate);
        return due >= today && due <= in7Days;
      });

      const overdue = active.filter((s: Doc<"subscriptions">) => {
        if (s.cycle === "one-off") return false;
        if (!s.nextPaymentDate) return false;
        return new Date(s.nextPaymentDate) < today;
      });

      const symbol = currencySymbol(user.currency ?? "USD");

      await sendWeeklyDigestEmail(user.email, {
        name: user.name,
        totalMonthly,
        currencySymbol: symbol,
        activeCount,
        upcoming: upcoming.map((s: Doc<"subscriptions">) => ({
          name: s.name,
          amount: s.amount,
          currency: s.currency,
          cycle: s.cycle,
          nextPaymentDate: s.nextPaymentDate,
        })),
        overdue: overdue.map((s: Doc<"subscriptions">) => ({
          name: s.name,
          amount: s.amount,
          currency: s.currency,
          cycle: s.cycle,
          nextPaymentDate: s.nextPaymentDate,
        })),
      });
    }
  },
});
