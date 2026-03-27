/** Current billing status of a subscription */
type SubscriptionStatus = "active" | "trial" | "paused" | "cancelled";

/** How often the subscription is billed */
type BillingCycle =
  | "weekly"
  | "monthly"
  | "annual"
  | "trial"
  | "usage-based"
  | "custom";

/** Contextual label shown above the renewal value on a card */
type RenewalLabel = "RENEWS_IN" | "RESUME_ON" | "NEXT_BILLING" | "TRIAL_ENDS";

/** A single subscription record */
interface Subscription {
  id: string;
  name: string;
  /** Optional plan tier e.g. "4K · HDR", "Premium Family Plan" */
  plan?: string;
  category: string;
  amount: number;
  /** ISO-4217 currency code, defaults to USD */
  currency?: string;
  /** True for usage-based subscriptions — renders amount with ~ prefix */
  amountApprox?: boolean;
  cycle: BillingCycle;
  status: SubscriptionStatus;
  renewalLabel: RenewalLabel;
  /** Human-readable renewal value e.g. "12 Days", "Oct 24, 2024", "Manual" */
  renewalValue: string;
  /** ISO date string for the next payment e.g. "2024-10-24" */
  nextPaymentDate?: string;
  /** Highlights renewal value in tertiary (urgent) color */
  renewalUrgent?: boolean;
  /** Tailwind bg class for the service icon tile */
  iconBg?: string;
  /** Raw rgba/hex color for the icon tile (used when iconBg is absent) */
  iconColor?: string;
  iconInitial: string;
  /** Hex color used for the detail-page gradient and calendar dot */
  gradientColor?: string;
  /** Hex color for the calendar grid dot */
  dotColor?: string;
  /** "auto" = charged automatically, "manual" = user confirms payment */
  paymentMode?: "auto" | "manual";
  /** Display name of the payment method e.g. "Apple Card •••• 8821" */
  paymentMethod?: string;
  /** Email or username of the account linked to this subscription */
  linkedEmail?: string;
  /** Descriptive label for the linked account */
  linkedLabel?: string;
  linkedIconInitial?: string;
  linkedIconBg?: string;
  remindersEnabled?: boolean;
  /** e.g. ["1d", "3d", "1w"] */
  reminderIntervals?: string[];
  vaultNotes?: string;
}
