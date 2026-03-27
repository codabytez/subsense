"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/lib/currency";

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; dot: string; badge: string; text: string }
> = {
  active: {
    label: "ACTIVE",
    dot: "bg-secondary",
    badge: "bg-secondary/10",
    text: "text-secondary",
  },
  trial: {
    label: "TRIAL",
    dot: "bg-tertiary",
    badge: "bg-tertiary/10",
    text: "text-tertiary",
  },
  paused: {
    label: "PAUSED",
    dot: "bg-muted",
    badge: "bg-muted/20",
    text: "text-muted",
  },
  cancelled: {
    label: "CANCELLED",
    dot: "bg-tertiary",
    badge: "bg-tertiary/10",
    text: "text-tertiary",
  },
};

const cycleLabel: Record<BillingCycle, string> = {
  weekly: "WEEKLY",
  monthly: "MONTHLY",
  annual: "ANNUAL",
  trial: "TRIAL ENDS",
  "usage-based": "USAGE-BASED",
  custom: "CUSTOM",
};

const renewalLabelDisplay: Record<RenewalLabel, string> = {
  RENEWS_IN: "RENEWS IN",
  RESUME_ON: "RESUME ON",
  NEXT_BILLING: "NEXT BILLING",
  TRIAL_ENDS: "TRIAL ENDS",
};

interface Props {
  subscription: Subscription;
  index: number;
  view?: "grid" | "list";
}

export function SubscriptionCard({
  subscription,
  index,
  view = "grid",
}: Props) {
  const {
    name,
    category,
    amount,
    amountApprox,
    cycle,
    status,
    renewalLabel,
    renewalValue,
    renewalUrgent,
    iconBg,
    iconColor,
    iconInitial,
    currency = "USD",
  } = subscription;

  const iconStyle = iconColor ? { backgroundColor: iconColor } : undefined;

  const s = statusConfig[status];

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
      >
        <Link
          href={`/dashboard/subscriptions/${subscription.id}`}
          className="bg-surface border border-border rounded-xl px-4 py-3 flex items-start gap-4 hover:border-primary/30 transition-colors"
        >
          {/* Icon */}
          <div
            className={cn(
              "size-10 rounded-xl flex items-center justify-center text-sm font-bold text-foreground shrink-0",
              iconBg
            )}
            style={iconStyle}
          >
            {iconInitial}
          </div>

          {/* Name + category */}
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="text-sm font-bold text-foreground leading-none truncate">
              {name}
            </span>
            <span className="text-[10px] text-muted font-medium uppercase tracking-widest">
              {category}
            </span>
          </div>

          {/* Status badge */}
          <span
            className={cn(
              "hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-widest shrink-0",
              s.badge,
              s.text
            )}
          >
            <span className={cn("w-1 h-1 rounded-full", s.dot)} />
            {s.label}
          </span>

          {/* Amount */}
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            <span className="text-sm font-bold text-foreground font-mono">
              {formatAmount(amount, currency, amountApprox)}
            </span>
            <span className="text-[9px] text-muted font-semibold uppercase tracking-widest">
              {cycleLabel[cycle]}
            </span>
          </div>

          {/* Renewal */}
          <div className="hidden md:flex flex-col items-end gap-0.5 shrink-0 w-24">
            <span
              className={cn(
                "text-sm font-semibold",
                renewalUrgent ? "text-tertiary" : "text-foreground"
              )}
            >
              {renewalValue}
            </span>
            <span className="text-[9px] text-muted font-semibold uppercase tracking-widest">
              {renewalLabelDisplay[renewalLabel]}
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/dashboard/subscriptions/${subscription.id}`}
        className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors"
      >
        {/* Top row — icon + status badge */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-foreground text-xl font-bold shrink-0",
              iconBg
            )}
            style={iconStyle}
          >
            {iconInitial}
          </div>

          <span
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest",
              s.badge,
              s.text
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
            {s.label}
          </span>
        </div>

        {/* Name + category */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold text-foreground leading-none">
            {name}
          </h3>
          <span className="self-start px-2 py-0.5 bg-muted/10 rounded text-[9px] font-semibold tracking-widest uppercase text-muted">
            {category}
          </span>
        </div>

        {/* Billing row */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-widest uppercase text-muted">
              {cycleLabel[cycle]}
            </span>
            <span className="text-2xl font-bold text-foreground font-mono">
              {formatAmount(amount, currency, amountApprox)}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-[9px] font-semibold tracking-widest uppercase text-muted">
              {renewalLabelDisplay[renewalLabel]}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                renewalUrgent ? "text-tertiary" : "text-foreground"
              )}
            >
              {renewalValue}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
