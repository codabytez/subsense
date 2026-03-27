import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";

const paymentMethodType = v.union(
  v.literal("card"),
  v.literal("paypal"),
  v.literal("apple_pay"),
  v.literal("google_pay"),
  v.literal("bank"),
  v.literal("other")
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

export const getPaymentMethods = query({
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
      .query("paymentMethods")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const createPaymentMethod = mutation({
  args: {
    type: paymentMethodType,
    label: v.string(),
    brand: v.optional(v.string()),
    last4: v.optional(v.string()),
    expiry: v.optional(v.string()),
  },
  handler: async (ctx, { type, label, brand, last4, expiry }) => {
    const user = await getAuthUser(ctx);

    // First method added becomes default automatically
    const existing = await ctx.db
      .query("paymentMethods")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const isDefault = existing.length === 0;

    return await ctx.db.insert("paymentMethods", {
      userId: user._id,
      type,
      label,
      brand,
      last4,
      expiry,
      isDefault,
    });
  },
});

export const updatePaymentMethod = mutation({
  args: {
    id: v.id("paymentMethods"),
    label: v.optional(v.string()),
    brand: v.optional(v.string()),
    last4: v.optional(v.string()),
    expiry: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    const user = await getAuthUser(ctx);
    const method = await ctx.db.get(id);
    if (!method || method.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(id, patch);
  },
});

export const setDefaultPaymentMethod = mutation({
  args: { id: v.id("paymentMethods") },
  handler: async (ctx, { id }) => {
    const user = await getAuthUser(ctx);
    const method = await ctx.db.get(id);
    if (!method || method.userId !== user._id) throw new Error("Not found");

    const all = await ctx.db
      .query("paymentMethods")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    await Promise.all(
      all.map((m) => ctx.db.patch(m._id, { isDefault: m._id === id }))
    );
  },
});

export const deletePaymentMethod = mutation({
  args: { id: v.id("paymentMethods") },
  handler: async (ctx, { id }) => {
    const user = await getAuthUser(ctx);
    const method = await ctx.db.get(id);
    if (!method || method.userId !== user._id) throw new Error("Not found");

    await ctx.db.delete(id);

    // If it was default, promote the first remaining method
    if (method.isDefault) {
      const remaining = await ctx.db
        .query("paymentMethods")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();
      if (remaining) await ctx.db.patch(remaining._id, { isDefault: true });
    }
  },
});

export const deletePaymentMethodsByUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const methods = await ctx.db
      .query("paymentMethods")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(methods.map((m) => ctx.db.delete(m._id)));
  },
});
