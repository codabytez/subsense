"use client";

import { StatCard } from "@/components/ui";

export function StatsPanel() {
  return (
    <div className="flex flex-col gap-3">
      <StatCard label="Active Subscriptions" value="18" badge="+2 New" />
      <StatCard label="Annual Projected Total" value="$2,973.60" />
      <StatCard
        label="Highest Cost Item"
        value="Adobe Suite"
        sub="$54.99/mo"
        subInline
      />
    </div>
  );
}
