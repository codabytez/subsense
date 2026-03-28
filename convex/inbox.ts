import {
  internalMutation,
  mutation,
  query,
  MutationCtx,
  QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";

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

// ── Queries ────────────────────────────────────────────────────

export const getNotifications = query({
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
      .query("inbox")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();
    if (!user) return 0;
    const unread = await ctx.db
      .query("inbox")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect();
    return unread.length;
  },
});

// ── Mutations ──────────────────────────────────────────────────

export const markAsRead = mutation({
  args: { id: v.id("inbox") },
  handler: async (ctx, { id }) => {
    const user = await getAuthUser(ctx);
    const notif = await ctx.db.get(id);
    if (!notif || notif.userId !== user._id) return;
    await ctx.db.patch(id, { read: true });
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    const unread = await ctx.db
      .query("inbox")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", user._id).eq("read", false)
      )
      .collect();
    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { read: true })));
  },
});

// ── Internal: write a notification ────────────────────────────

export const createNotification = internalMutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("reminder"),
      v.literal("overdue"),
      v.literal("payment_confirmed"),
      v.literal("auto_payment"),
      v.literal("price_change")
    ),
    title: v.string(),
    message: v.string(),
    subscriptionId: v.optional(v.id("subscriptions")),
    link: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { userId, type, title, message, subscriptionId, link }
  ) => {
    await ctx.db.insert("inbox", {
      userId,
      type,
      title,
      message,
      read: false,
      subscriptionId,
      link,
    });
  },
});

// ── Internal: cascade delete ───────────────────────────────────

export const deleteNotificationsByUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const all = await ctx.db
      .query("inbox")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(all.map((n) => ctx.db.delete(n._id)));
  },
});

export const deleteNotificationsBySubscription = internalMutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, { subscriptionId }) => {
    const all = await ctx.db
      .query("inbox")
      .withIndex("by_subscription", (q) =>
        q.eq("subscriptionId", subscriptionId)
      )
      .collect();
    await Promise.all(all.map((n) => ctx.db.delete(n._id)));
  },
});
