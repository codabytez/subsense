import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    currency: v.string(),
    avatarUrl: v.optional(v.string()),
    notifEmailDigest: v.optional(v.boolean()),
    notifPushEnabled: v.optional(v.boolean()),
    notifPriceSensitivity: v.optional(v.boolean()),
  }).index("by_email", ["email"]),

  categories: defineTable({
    userId: v.id("users"),
    name: v.string(),
    color: v.string(),
  }).index("by_user", ["userId"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    name: v.string(),
    plan: v.optional(v.string()),
    amount: v.number(),
    amountApprox: v.boolean(),
    currency: v.string(),
    cycle: v.union(
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("annual"),
      v.literal("trial"),
      v.literal("usage-based"),
      v.literal("custom")
    ),
    customInterval: v.optional(v.string()),
    nextPaymentDate: v.string(),
    category: v.string(),
    paymentMethodId: v.optional(v.id("paymentMethods")),
    paymentMode: v.union(v.literal("auto"), v.literal("manual")),
    remindersEnabled: v.boolean(),
    reminderIntervals: v.array(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("trial"),
      v.literal("paused"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
    iconColor: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  paymentMethods: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("card"),
      v.literal("paypal"),
      v.literal("apple_pay"),
      v.literal("google_pay"),
      v.literal("bank"),
      v.literal("other")
    ),
    label: v.string(),
    brand: v.optional(v.string()),
    last4: v.optional(v.string()),
    expiry: v.optional(v.string()),
    isDefault: v.boolean(),
  }).index("by_user", ["userId"]),
});
