"use client";

import { motion } from "framer-motion";
import { ReceiptItem, Calendar, ChartSquare } from "iconsax-reactjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id, Doc } from "@/convex/_generated/dataModel";
import { formatAmount } from "@/lib/currency";

interface StatBlockProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  index: number;
}

function StatBlock({ label, value, sub, icon: Icon, index }: StatBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: "easeOut" }}
      className="relative bg-surface border border-border rounded-xl p-5 flex flex-col gap-2 flex-1"
    >
      <div className="absolute top-4 right-4 text-muted/30">
        <Icon size={22} color="currentColor" variant="Bold" />
      </div>
      <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
        {label}
      </span>
      <span className="text-2xl font-bold text-foreground font-mono">
        {value}
      </span>
      {sub && <span className="text-xs font-medium text-muted">{sub}</span>}
    </motion.div>
  );
}

function monthlyEquivalent(sub: Doc<"subscriptions">): number {
  if (sub.cycle === "one-off") return 0;
  if (sub.cycle === "annual") return sub.amount / 12;
  if (sub.cycle === "weekly") return sub.amount * 4.33;
  return sub.amount;
}

function daysUntilLabel(
  nextPaymentDate: string,
  isOneOff: boolean
): {
  value: string;
  sub: string;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(nextPaymentDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  const dateStr = due.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: due.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });

  if (isOneOff) {
    if (diff < 0) return { value: "Expired", sub: dateStr };
    if (diff === 0) return { value: "Today", sub: `Expires ${dateStr}` };
    if (diff === 1) return { value: "1 Day", sub: `Expires ${dateStr}` };
    return { value: `${diff} Days`, sub: `Expires ${dateStr}` };
  }

  if (diff < 0) return { value: "Overdue", sub: dateStr };
  if (diff === 0) return { value: "Today", sub: dateStr };
  if (diff === 1) return { value: "1 Day", sub: dateStr };
  return { value: `${diff} Days`, sub: dateStr };
}

interface Props {
  sub: Doc<"subscriptions">;
  userCurrency: string;
}

export function SubscriptionStats({ sub, userCurrency }: Props) {
  const logs = useQuery(api.paymentLogs.getPaymentLogs, {
    subscriptionId: sub._id as Id<"subscriptions">,
  });

  const totalSpent = (logs ?? []).reduce((sum, l) => sum + l.amount, 0);
  const logCount = logs?.length ?? 0;

  const isOneOff = sub.cycle === "one-off";
  const billing = daysUntilLabel(sub.nextPaymentDate, isOneOff);
  const monthly = monthlyEquivalent(sub);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <StatBlock
        label="Total Spent to Date"
        value={formatAmount(totalSpent, sub.currency ?? userCurrency)}
        sub={
          logCount > 0
            ? `${logCount} payment${logCount === 1 ? "" : "s"} logged`
            : "No payments logged yet"
        }
        icon={ReceiptItem}
        index={0}
      />
      <StatBlock
        label={isOneOff ? "Expires In" : "Next Billing"}
        value={billing.value}
        sub={isOneOff ? billing.sub : `Renews on ${billing.sub}`}
        icon={Calendar}
        index={1}
      />
      <StatBlock
        label={isOneOff ? "One-off Cost" : "Monthly Cost"}
        value={`${sub.amountApprox ? "~" : ""}${formatAmount(isOneOff ? sub.amount : monthly, sub.currency ?? userCurrency)}`}
        sub={sub.plan ?? (isOneOff ? "One-time payment" : sub.cycle)}
        icon={ChartSquare}
        index={2}
      />
    </div>
  );
}
