"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DonutChart } from "@/components/ui";
import { formatAmount, getCurrencySymbol } from "@/lib/currency";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";
const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  DEFAULT_CATEGORIES.map((c) => [c.name, c.color])
);

function normalizeToMonthly(amount: number, cycle: string): number {
  switch (cycle) {
    case "weekly":
      return (amount * 52) / 12;
    case "annual":
      return amount / 12;
    default:
      return amount;
  }
}

export function MonthlyBurn() {
  const subs = useQuery(api.subscriptions.getSubscriptions);
  const user = useQuery(api.users.getCurrentUser);

  const userCurrency = user?.currency ?? "USD";
  const symbol = getCurrencySymbol(userCurrency);

  const { monthlyTotal, segments, activeCount } = useMemo(() => {
    if (!subs) return { monthlyTotal: 0, segments: [], activeCount: 0 };

    const active = subs.filter(
      (s) => s.status === "active" || s.status === "trial"
    );
    const totalPerCategory: Record<string, number> = {};
    let total = 0;

    for (const sub of active) {
      const monthly = normalizeToMonthly(sub.amount, sub.cycle);
      total += monthly;
      totalPerCategory[sub.category] =
        (totalPerCategory[sub.category] ?? 0) + monthly;
    }

    const segs = Object.entries(totalPerCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([label, value]) => ({
        label,
        value,
        color: CATEGORY_COLORS[label] ?? "#94A3B8",
      }));

    return { monthlyTotal: total, segments: segs, activeCount: active.length };
  }, [subs]);

  const isLoading = subs === undefined || user === undefined;

  // Split into integer and decimal parts for the big display
  const intStr = Math.floor(monthlyTotal).toLocaleString("en-US");
  const decStr = (monthlyTotal % 1).toFixed(2).slice(1); // ".XX" → "XX"

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-6">
      {/* Left */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-4 flex-1 min-w-0"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
          Current Monthly Burn
        </span>

        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-3">
            <div className="h-20 w-64 bg-white/10 rounded" />
            <div className="h-4 w-40 bg-white/[0.07] rounded" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline leading-none">
              <span className="text-[48px] xl:text-[80px] font-bold text-foreground/15 font-mono leading-none">
                {symbol}
                {intStr}
              </span>
              <span className="text-[48px] xl:text-[80px] font-bold text-primary font-mono leading-none">
                {decStr}
              </span>
            </div>
            <p className="text-sm text-muted">
              {activeCount} active subscription{activeCount !== 1 ? "s" : ""}{" "}
              tracked
            </p>
          </>
        )}
      </motion.div>

      {/* Right — donut */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
        className="bg-surface border border-border rounded-xl p-6 xl:shrink-0"
      >
        {isLoading ? (
          <div className="animate-pulse flex flex-col xl:flex-row items-center gap-4 xl:gap-6">
            <div className="w-35 h-35 rounded-full bg-white/10 shrink-0" />
            <div className="flex flex-col gap-3 w-full xl:min-w-48">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="h-3 w-28 bg-white/10 rounded" />
                  <div className="h-3 w-14 bg-white/[0.07] rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : segments.length > 0 ? (
          <DonutChart
            segments={segments}
            centerLabel="Monthly"
            centerValue={formatAmount(monthlyTotal, userCurrency)}
            formatValue={(v) => formatAmount(v, userCurrency)}
          />
        ) : (
          <p className="text-sm text-muted py-4 px-2 min-w-48">
            No active subscriptions yet.
          </p>
        )}
      </motion.div>
    </div>
  );
}
