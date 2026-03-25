"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  badge?: string;
  /** Shown below the value */
  sub?: string;
  /** When true, value and sub are on the same row (flex justify-between) */
  subInline?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  badge,
  sub,
  subInline,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-surface border border-border rounded-2xl px-5 py-4 flex flex-col gap-2",
        className
      )}
    >
      <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
        {label}
      </span>

      {subInline ? (
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {sub && (
            <span className="text-sm font-semibold text-muted font-mono">
              {sub}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground font-mono">
            {value}
          </span>
          {badge && (
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {badge}
            </span>
          )}
        </div>
      )}

      {sub && !subInline && <span className="text-xs text-muted">{sub}</span>}
    </motion.div>
  );
}
