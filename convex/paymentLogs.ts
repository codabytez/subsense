import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

async function getAuthUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.email!))
    .unique();
  if (!user) throw new Error("User not found");
  return user;
}

/** Advance nextPaymentDate by one cycle from a given date string */
export function advanceDate(fromDate: string, cycle: string): string {
  const d = new Date(fromDate);
  switch (cycle) {
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "annual":
      d.setFullYear(d.getFullYear() + 1);
      break;
    case "monthly":
    case "trial":
    default:
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d.toISOString().split("T")[0];
}

// ── Queries ────────────────────────────────────────────────────

export const getPaymentLogs = query({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, { subscriptionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();
    if (!user) return [];
    const sub = await ctx.db.get(subscriptionId);
    if (!sub || sub.userId !== user._id) return [];
    return await ctx.db
      .query("paymentLogs")
      .withIndex("by_subscription", (q) =>
        q.eq("subscriptionId", subscriptionId)
      )
      .order("desc")
      .collect();
  },
});

// ── Mutations ──────────────────────────────────────────────────

/** Confirm a manual payment — logs it and advances nextPaymentDate */
export const confirmPayment = mutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, { subscriptionId }) => {
    const user = await getAuthUser(ctx);
    const sub = await ctx.db.get(subscriptionId);
    if (!sub || sub.userId !== user._id) throw new Error("Not found");

    const today = new Date().toISOString().split("T")[0];

    await ctx.db.insert("paymentLogs", {
      subscriptionId,
      userId: user._id,
      amount: sub.amount,
      currency: sub.currency,
      date: today,
      paymentMethodId: sub.paymentMethodId,
    });

    await ctx.db.patch(subscriptionId, {
      nextPaymentDate: advanceDate(sub.nextPaymentDate, sub.cycle),
    });

    await ctx.runMutation(internal.inbox.createNotification, {
      userId: user._id,
      type: "payment_confirmed",
      title: "Payment confirmed",
      message: `${sub.name} — ${sub.currency} ${sub.amount.toFixed(2)} marked as paid.`,
      subscriptionId,
      link: `/dashboard/subscriptions/${subscriptionId}`,
    });
  },
});

/** Update subscription status (active / paused / cancelled) */
export const updateStatus = mutation({
  args: {
    id: v.id("subscriptions"),
    status: v.union(
      v.literal("active"),
      v.literal("trial"),
      v.literal("paused"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, status }) => {
    const user = await getAuthUser(ctx);
    const sub = await ctx.db.get(id);
    if (!sub || sub.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(id, { status });
  },
});

/** Update ROI & Usage fields */
export const updateUsage = mutation({
  args: {
    id: v.id("subscriptions"),
    usageFrequency: v.optional(
      v.union(v.literal("rarely"), v.literal("weekly"), v.literal("daily"))
    ),
    usageNotes: v.optional(v.string()),
  },
  handler: async (ctx, { id, usageFrequency, usageNotes }) => {
    const user = await getAuthUser(ctx);
    const sub = await ctx.db.get(id);
    if (!sub || sub.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(id, { usageFrequency, usageNotes });
  },
});

/** Update linked account email + label */
export const updateLinkedAccount = mutation({
  args: {
    id: v.id("subscriptions"),
    linkedEmail: v.string(),
    linkedLabel: v.optional(v.string()),
  },
  handler: async (ctx, { id, linkedEmail, linkedLabel }) => {
    const user = await getAuthUser(ctx);
    const sub = await ctx.db.get(id);
    if (!sub || sub.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(id, { linkedEmail, linkedLabel });
  },
});

/** Delete a single payment log (user correction) */
export const deletePaymentLog = mutation({
  args: { id: v.id("paymentLogs") },
  handler: async (ctx, { id }) => {
    const user = await getAuthUser(ctx);
    const log = await ctx.db.get(id);
    if (!log || log.userId !== user._id) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});

/** Delete all payment logs for a subscription (used in cascade delete) */
export const deleteLogsBySubscription = internalMutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, { subscriptionId }) => {
    const logs = await ctx.db
      .query("paymentLogs")
      .withIndex("by_subscription", (q) =>
        q.eq("subscriptionId", subscriptionId)
      )
      .collect();
    await Promise.all(logs.map((l) => ctx.db.delete(l._id)));
  },
});

/** Delete all payment logs for a user (used in account deletion) */
export const deleteLogsByUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const logs = await ctx.db
      .query("paymentLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(logs.map((l) => ctx.db.delete(l._id)));
  },
});

/** Process auto-payments for all subs due today (called by 12pm cron) */
export const processAutoPayments = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const allSubs = await ctx.db.query("subscriptions").collect();

    for (const sub of allSubs) {
      if (sub.paymentMode !== "auto") continue;
      if (sub.status === "cancelled" || sub.status === "paused") continue;
      if (sub.nextPaymentDate !== today) continue;

      await ctx.db.insert("paymentLogs", {
        subscriptionId: sub._id,
        userId: sub.userId,
        amount: sub.amount,
        currency: sub.currency,
        date: today,
        paymentMethodId: sub.paymentMethodId,
      });

      await ctx.db.patch(sub._id, {
        nextPaymentDate: advanceDate(sub.nextPaymentDate, sub.cycle),
      });

      await ctx.runMutation(internal.inbox.createNotification, {
        userId: sub.userId,
        type: "auto_payment",
        title: "Auto-payment processed",
        message: `${sub.name} — ${sub.currency} ${sub.amount.toFixed(2)} was automatically logged.`,
        subscriptionId: sub._id,
        link: `/dashboard/subscriptions/${sub._id}`,
      });
    }
  },
});

/** Last 20 payment logs for the current user, joined with sub name + iconColor */
export const getRecentLogs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();
    if (!user) return [];
    const logs = await ctx.db
      .query("paymentLogs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(20);
    return await Promise.all(
      logs.map(async (log) => {
        const sub = await ctx.db.get(log.subscriptionId);
        return {
          ...log,
          subName: sub?.name ?? "Unknown",
          subIconColor: sub?.iconColor ?? "rgba(100,100,100,0.2)",
        };
      })
    );
  },
});

/** Helper used by notifications to get total paid for a subscription */
export async function getTotalSpent(
  ctx: QueryCtx,
  subscriptionId: Id<"subscriptions">
): Promise<number> {
  const logs = await ctx.db
    .query("paymentLogs")
    .withIndex("by_subscription", (q) => q.eq("subscriptionId", subscriptionId))
    .collect();
  return logs.reduce((sum, l) => sum + l.amount, 0);
}
