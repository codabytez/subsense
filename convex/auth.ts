import { betterAuth } from "better-auth";
import { createClient, GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import authConfig from "./auth.config";
import { sendVerificationEmail, sendPasswordResetEmail } from "./lib/email";

export const authComponent = createClient(components.betterAuth);

export const createAuth = (ctx: GenericCtx) => {
  return betterAuth({
    appName: "Subsense",
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    trustedOrigins: [
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "https://*.vercel.app",
      "https://*.unbuilt.studio",
    ],
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        prompt: "select_account",
      },
    },
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        await sendPasswordResetEmail(user.email, user.name, url);
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerificationEmail(user.email, user.name, url);
      },
    },
    database: authComponent.adapter(ctx),
    plugins: [convex({ authConfig })],
  });
};
