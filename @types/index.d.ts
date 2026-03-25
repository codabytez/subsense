/** Current billing status of a subscription */
type SubscriptionStatus = "active" | "trial" | "paused";

/** How often the subscription is billed */
type BillingCycle = "monthly" | "annual" | "trial" | "usage-based";

/** Contextual label shown above the renewal value on a card */
type RenewalLabel = "RENEWS_IN" | "RESUME_ON" | "NEXT_BILLING" | "TRIAL_ENDS";

/** A single subscription record */
interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  /** True for usage-based subscriptions — renders amount with ~ prefix */
  amountApprox?: boolean;
  cycle: BillingCycle;
  status: SubscriptionStatus;
  renewalLabel: RenewalLabel;
  /** Human-readable renewal value e.g. "12 Days", "Oct 24, 2024", "Manual" */
  renewalValue: string;
  /** Highlights renewal value in tertiary (urgent) color */
  renewalUrgent?: boolean;
  /** Tailwind bg class for the service icon tile */
  iconBg: string;
  iconInitial: string;
}
