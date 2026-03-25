"use client";

import { motion } from "framer-motion";

export function ProjectionCard() {
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
        October Projection
      </p>

      <div className="flex items-baseline gap-2.5">
        <span className="text-4xl font-bold text-foreground font-mono">
          $1,240.50
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: "var(--color-secondary)" }}
        >
          +4.2%
        </span>
      </div>

      <p className="text-xs text-muted">
        Estimated total for 14 active subscriptions
      </p>
    </motion.div>
  );
}
