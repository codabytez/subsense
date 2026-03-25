"use client";

import { motion } from "framer-motion";
import { ReceiptItem, Calendar, ChartSquare, TrendUp } from "iconsax-reactjs";

interface StatBlockProps {
  label: string;
  value: string;
  sub?: string;
  subHighlight?: boolean;
  icon: React.ElementType;
  index: number;
}

function StatBlock({
  label,
  value,
  sub,
  subHighlight,
  icon: Icon,
  index,
}: StatBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: "easeOut" }}
      className="relative bg-surface border border-border rounded-xl p-5 flex flex-col gap-2 flex-1"
    >
      {/* Muted icon top-right */}
      <div className="absolute top-4 right-4 text-muted/30">
        <Icon size={22} color="currentColor" variant="Bold" />
      </div>

      <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
        {label}
      </span>
      <span className="text-2xl font-bold text-foreground font-mono">
        {value}
      </span>
      {sub && (
        <div className="flex items-center gap-1">
          {subHighlight && <TrendUp size={12} color="var(--color-secondary)" />}
          <span
            className={`text-xs font-medium ${subHighlight ? "text-secondary" : "text-muted"}`}
          >
            {sub}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function SubscriptionStats() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <StatBlock
        label="Total Spent to Date"
        value="$191.88"
        sub="12 months tracked"
        subHighlight
        icon={ReceiptItem}
        index={0}
      />
      <StatBlock
        label="Next Billing"
        value="12 days"
        sub="Renews on Oct 24, 2024"
        icon={Calendar}
        index={1}
      />
      <StatBlock
        label="Monthly Cost"
        value="$15.99"
        sub="Premium Family Plan"
        icon={ChartSquare}
        index={2}
      />
    </div>
  );
}
