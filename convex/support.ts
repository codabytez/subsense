import { action } from "./_generated/server";
import { v } from "convex/values";
import { sendSupportEmail } from "./lib/email";

export const submitSupportRequest = action({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, { name, email, subject, message }) => {
    await sendSupportEmail(name, email, subject, message);
  },
});
