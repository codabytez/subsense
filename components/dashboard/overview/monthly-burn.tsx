"use client";

import { motion } from "framer-motion";
import { TrendUp } from "iconsax-reactjs";
import { DonutChart } from "@/components/ui";

const spendingBreakdown = [
  { label: "Entertainment", value: 148.2, color: "var(--color-primary)" },
  { label: "Productivity", value: 62.0, color: "var(--color-secondary)" },
  { label: "Wellness", value: 37.6, color: "var(--color-tertiary)" },
];

export function MonthlyBurn() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
      {/* Left — no card, sits on raw background */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-4 flex-1"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
          Current Monthly Burn
        </span>

        {/* Amount — ghost integer, purple decimal */}
        <div className="flex items-baseline leading-none">
          <span className="text-[80px] font-bold text-foreground/15 font-mono leading-none">
            $247.
          </span>
          <span className="text-[80px] font-bold text-primary font-mono leading-none">
            80
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-tertiary text-sm font-semibold">
            <TrendUp size={14} color="currentColor" />
            12% vs last month
          </div>
          <span className="w-1 h-1 rounded-full bg-muted shrink-0" />
          <span className="text-sm text-muted">
            Next increase expected in{" "}
            <span className="text-foreground font-medium">4 days</span>
          </span>
        </div>
      </motion.div>

      {/* Right — donut in its own card */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
        className="bg-surface border border-border rounded-xl p-6 shrink-0"
      >
        <DonutChart
          segments={spendingBreakdown}
          centerLabel="Spent"
          centerValue="100%"
        />
      </motion.div>
    </div>
  );
}
