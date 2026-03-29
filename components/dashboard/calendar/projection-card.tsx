"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatAmount } from "@/lib/currency";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface ProjectionCardProps {
  subs: Doc<"subscriptions">[] | undefined;
  userCurrency: string;
}

export function ProjectionCard({ subs, userCurrency }: ProjectionCardProps) {
  const now = new Date();
  const month = MONTH_NAMES[now.getMonth()];
  const year = now.getFullYear();
  const currentMonth = now.getMonth();

  const { total, count } = useMemo(() => {
    if (!subs) return { total: 0, count: 0 };
    const dueThisMonth = subs.filter((s) => {
      if (
        s.status === "cancelled" ||
        s.status === "paused" ||
        s.status === "expired" ||
        s.status === "lapsed"
      )
        return false;
      if (s.cycle === "one-off") return false;
      if (!s.nextPaymentDate) return false;
      const due = new Date(s.nextPaymentDate);
      return due.getFullYear() === year && due.getMonth() === currentMonth;
    });
    return {
      total: dueThisMonth.reduce((sum, s) => sum + s.amount, 0),
      count: dueThisMonth.length,
    };
  }, [subs, year, currentMonth]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl p-5 flex flex-col gap-3 border border-border"
      style={{ backgroundColor: "rgba(124,92,252,0.08)" }}
    >
      <p
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: "var(--color-primary)" }}
      >
        {month} Projection
      </p>

      {subs === undefined ? (
        <div className="animate-pulse flex flex-col gap-2">
          <div className="h-9 w-36 bg-white/10 rounded" />
          <div className="h-3 w-48 bg-white/[0.07] rounded" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-bold text-foreground font-mono">
              {formatAmount(total, userCurrency)}
            </span>
          </div>
          <p className="text-xs text-muted">
            {count} payment{count !== 1 ? "s" : ""} due in {month}
          </p>
        </>
      )}
    </motion.div>
  );
}
