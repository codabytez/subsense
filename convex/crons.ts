import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Every Monday at 8am UTC
crons.weekly(
  "weekly-digest",
  { dayOfWeek: "monday", hourUTC: 8, minuteUTC: 0 },
  internal.notifications.sendWeeklyDigests
);

// Every day at 8am UTC — subscription renewal reminders
crons.daily(
  "subscription-reminders",
  { hourUTC: 8, minuteUTC: 0 },
  internal.notifications.sendSubscriptionReminders
);

// Every day at 12pm UTC — process auto-payments for subs due today
crons.daily(
  "auto-payment-processing",
  { hourUTC: 12, minuteUTC: 0 },
  internal.paymentLogs.processAutoPayments
);

export default crons;
