import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { GenericActionCtx, GenericDataModel } from "convex/server";
import { authComponent, createAuth } from "./auth";

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const email = identity.email;
    if (!email) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const createUser = mutation({
  args: { currency: v.string() },
  handler: async (ctx, { currency }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const email = identity.email;
    if (!email) throw new Error("No email in session");
    const name = (identity.name as string | undefined) ?? "";
    return await ctx.db.insert("users", { name, email, currency });
  },
});

export const findByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const deleteUserData = internalMutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    // TODO: delete subscriptions and other app data tied to this user
  },
});

export const deleteAccount = action({
  args: {},
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(
      createAuth,
      ctx as unknown as GenericActionCtx<GenericDataModel>
    );

    // Get session so we can identify the Convex app user
    const session = await auth.api.getSession({ headers });
    if (!session?.user) throw new Error("Not authenticated");

    // Delete from Better Auth (wipes sessions, accounts, jwks refs, etc.)
    await auth.api.deleteUser({ headers, body: {} });

    // Delete app-level data from Convex
    const appUser = await ctx.runQuery(internal.users.findByEmail, {
      email: session.user.email,
    });
    if (appUser) {
      await ctx.runMutation(internal.users.deleteUserData, { id: appUser._id });
    }
  },
});
