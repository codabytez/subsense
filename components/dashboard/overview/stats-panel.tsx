"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StatCard } from "@/components/ui";
import { formatAmount } from "@/lib/currency";
import type { Doc } from "@/convex/_generated/dataModel";

function normalizeToMonthly(sub: Doc<"subscriptions">): number {
  switch (sub.cycle) {
    case "weekly":
      return (sub.amount * 52) / 12;
    case "annual":
      return sub.amount / 12;
    default:
      return sub.amount;
  }
}

export function StatsPanel() {
  const subs = useQuery(api.subscriptions.getSubscriptions);
  const user = useQuery(api.users.getCurrentUser);
  const userCurrency = user?.currency ?? "USD";
  const [now] = useState(() => Date.now());

  const { activeCount, newCount, annualTotal, highestSub } = useMemo(() => {
    if (!subs)
      return { activeCount: 0, newCount: 0, annualTotal: 0, highestSub: null };

    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const active = subs.filter(
      (s) => s.status === "active" || s.status === "trial"
    );
    const newCount = active.filter(
      (s) => s._creationTime >= sevenDaysAgo
    ).length;
    const annualTotal = active.reduce(
      (sum, s) => sum + normalizeToMonthly(s) * 12,
      0
    );
    const highestSub =
      active.length > 0
        ? active.reduce(
            (max, s) =>
              normalizeToMonthly(s) > normalizeToMonthly(max) ? s : max,
            active[0]
          )
        : null;

    return { activeCount: active.length, newCount, annualTotal, highestSub };
  }, [subs, now]);

  if (subs === undefined) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-surface border border-border rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <StatCard
        label="Active Subscriptions"
        value={String(activeCount)}
        badge={newCount > 0 ? `+${newCount} New` : undefined}
      />
      <StatCard
        label="Annual Projected Total"
        value={formatAmount(annualTotal, userCurrency)}
      />
      {highestSub ? (
        <StatCard
          label="Highest Cost Item"
          value={highestSub.name}
          sub={`${formatAmount(normalizeToMonthly(highestSub), userCurrency)}/mo`}
          subInline
        />
      ) : (
        <StatCard label="Highest Cost Item" value="—" />
      )}
    </div>
  );
}
