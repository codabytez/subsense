"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Id } from "@/convex/_generated/dataModel";
import { formatAmount } from "@/lib/currency";
import { ServiceIcon } from "@/components/ui/service-icon";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

interface RenewalCardProps {
  id: Id<"subscriptions">;
  dateLabel: string;
  amount: number;
  currency: string;
  name: string;
  nextBilling: string;
  iconColor: string;
  urgent?: boolean;
  index: number;
}

export function RenewalCard({
  id,
  dateLabel,
  amount,
  currency,
  name,
  nextBilling,
  iconColor,
  urgent,
  index,
}: RenewalCardProps) {
  const initials = getInitials(name);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/dashboard/subscriptions/${id}`}
        className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between gap-8 min-w-64 shrink-0 hover:border-primary/30 transition-colors"
      >
        {/* Top row: icon left, date + amount right */}
        <div className="flex items-start justify-between gap-3">
          <ServiceIcon
            name={name}
            iconColor={iconColor}
            iconInitial={initials}
            className="w-12 h-12 rounded-2xl"
            initialClassName="text-base"
          />

          <div className="flex flex-col items-end">
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{
                color: urgent ? "var(--color-tertiary)" : "var(--color-muted)",
              }}
            >
              {dateLabel}
            </span>
            <span className="text-2xl font-bold text-foreground font-mono">
              {formatAmount(amount, currency)}
            </span>
          </div>
        </div>

        {/* Bottom: name + billing */}
        <div>
          <p className="text-xl font-bold text-foreground">{name}</p>
          <p className="text-sm text-muted mt-1">Next billing: {nextBilling}</p>
        </div>
      </Link>
    </motion.div>
  );
}
