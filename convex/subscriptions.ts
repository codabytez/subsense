import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const cycleValidator = v.union(
  v.literal("weekly"),
  v.literal("monthly"),
  v.literal("annual"),
  v.literal("trial"),
  v.literal("usage-based"),
  v.literal("custom")
);

const statusValidator = v.union(
  v.literal("active"),
  v.literal("trial"),
  v.literal("paused"),
  v.literal("cancelled")
);

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

export const getSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();
    if (!user) return [];
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getSubscriptionById = query({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const sub = await ctx.db.get(id);
    if (!sub) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();
    if (!user || sub.userId !== user._id) return null;
    return sub;
  },
});

export const createSubscription = mutation({
  args: {
    name: v.string(),
    plan: v.optional(v.string()),
    amount: v.number(),
    amountApprox: v.boolean(),
    currency: v.string(),
    cycle: cycleValidator,
    customInterval: v.optional(v.string()),
    nextPaymentDate: v.string(),
    category: v.string(),
    paymentMethodId: v.optional(v.id("paymentMethods")),
    paymentMode: v.union(v.literal("auto"), v.literal("manual")),
    remindersEnabled: v.boolean(),
    reminderIntervals: v.array(v.string()),
    status: statusValidator,
    notes: v.optional(v.string()),
    iconColor: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.insert("subscriptions", { userId: user._id, ...args });
  },
});

export const updateSubscription = mutation({
  args: {
    id: v.id("subscriptions"),
    name: v.optional(v.string()),
    plan: v.optional(v.string()),
    amount: v.optional(v.number()),
    amountApprox: v.optional(v.boolean()),
    currency: v.optional(v.string()),
    cycle: v.optional(cycleValidator),
    customInterval: v.optional(v.string()),
    nextPaymentDate: v.optional(v.string()),
    category: v.optional(v.string()),
    paymentMethodId: v.optional(v.id("paymentMethods")),
    paymentMode: v.optional(v.union(v.literal("auto"), v.literal("manual"))),
    remindersEnabled: v.optional(v.boolean()),
    reminderIntervals: v.optional(v.array(v.string())),
    status: v.optional(statusValidator),
    notes: v.optional(v.string()),
    iconColor: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    const user = await getAuthUser(ctx);
    const sub = await ctx.db.get(id);
    if (!sub || sub.userId !== user._id) throw new Error("Not found");

    const amountChanged =
      patch.amount !== undefined && patch.amount !== sub.amount;

    await ctx.db.patch(id, patch);

    if (amountChanged && user.notifPriceSensitivity && !user.notifMuteAll) {
      await ctx.scheduler.runAfter(
        0,
        internal.notifications.sendPriceChangeNotification,
        {
          userId: user._id,
          subscriptionId: id,
          email: user.email,
          name: user.name,
          serviceName: sub.name,
          oldAmount: sub.amount,
          newAmount: patch.amount!,
          currency: sub.currency,
        }
      );
    }
  },
});

export const deleteSubscription = mutation({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, { id }) => {
    const user = await getAuthUser(ctx);
    const sub = await ctx.db.get(id);
    if (!sub || sub.userId !== user._id) throw new Error("Not found");
    await ctx.runMutation(internal.paymentLogs.deleteLogsBySubscription, {
      subscriptionId: id,
    });
    await ctx.runMutation(internal.inbox.deleteNotificationsBySubscription, {
      subscriptionId: id,
    });
    await ctx.db.delete(id);
  },
});

export const deleteSubscriptionsByUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const subs = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(
      subs.map(async (s) => {
        await ctx.runMutation(internal.paymentLogs.deleteLogsBySubscription, {
          subscriptionId: s._id,
        });
        await ctx.runMutation(
          internal.inbox.deleteNotificationsBySubscription,
          {
            subscriptionId: s._id,
          }
        );
        await ctx.db.delete(s._id);
      })
    );
  },
});
