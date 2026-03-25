"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RenewalCardProps {
  id: string;
  dateLabel: string;
  amount: number;
  name: string;
  nextBilling: string;
  iconBg: string;
  iconInitial: string;
  urgent?: boolean;
  index: number;
}

export function RenewalCard({
  id,
  dateLabel,
  amount,
  name,
  nextBilling,
  iconBg,
  iconInitial,
  urgent,
  index,
}: RenewalCardProps) {
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
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold text-foreground shrink-0",
              iconBg
            )}
          >
            {iconInitial}
          </div>

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
              ${amount.toFixed(2)}
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
