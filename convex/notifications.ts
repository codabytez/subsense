import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { sendWeeklyDigestEmail } from "./lib/email";

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
    return all.filter((u) => u.notifEmailDigest === true);
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

// ── Price change action ────────────────────────────────────────

export const sendPriceChangeNotification = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    serviceName: v.string(),
    oldAmount: v.number(),
    newAmount: v.number(),
    currency: v.string(),
  },
  handler: async (
    _ctx,
    { email, name, serviceName, oldAmount, newAmount, currency }
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
          s.status !== "paused" && s.status !== "cancelled"
      );
      const activeCount = subs.filter(
        (s: Doc<"subscriptions">) => s.status === "active"
      ).length;

      const totalMonthly = active.reduce(
        (sum: number, s: Doc<"subscriptions">) => {
          if (s.cycle === "annual") return sum + s.amount / 12;
          if (s.cycle === "weekly") return sum + s.amount * 4.33;
          return sum + s.amount;
        },
        0
      );

      const upcoming = active.filter((s: Doc<"subscriptions">) => {
        if (!s.nextPaymentDate) return false;
        const due = new Date(s.nextPaymentDate);
        return due >= today && due <= in7Days;
      });

      const overdue = active.filter((s: Doc<"subscriptions">) => {
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
