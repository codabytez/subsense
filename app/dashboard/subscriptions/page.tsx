"use client";

import { useMemo, useState } from "react";
import { FadeIn } from "@/components/motion";
import {
  SubscriptionCard,
  SubscriptionFilters,
} from "@/components/dashboard/subscriptions";
import { ViewToggle, Fab } from "@/components/ui";

const subscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    category: "Entertainment",
    amount: 15.99,
    cycle: "monthly",
    status: "active",
    renewalLabel: "RENEWS_IN",
    renewalValue: "12 Days",
    iconBg: "bg-tertiary/20",
    iconInitial: "N",
  },
  {
    id: "2",
    name: "Spotify",
    category: "Entertainment",
    amount: 120.0,
    cycle: "annual",
    status: "active",
    renewalLabel: "RENEWS_IN",
    renewalValue: "Oct 24, 2024",
    iconBg: "bg-secondary/20",
    iconInitial: "S",
  },
  {
    id: "3",
    name: "Linear",
    category: "Productivity",
    amount: 0.0,
    cycle: "trial",
    status: "trial",
    renewalLabel: "TRIAL_ENDS",
    renewalValue: "4 Days",
    renewalUrgent: true,
    iconBg: "bg-primary/20",
    iconInitial: "L",
  },
  {
    id: "4",
    name: "Notion",
    category: "Productivity",
    amount: 10.0,
    cycle: "monthly",
    status: "active",
    renewalLabel: "RENEWS_IN",
    renewalValue: "3 Days",
    iconBg: "bg-muted/20",
    iconInitial: "N",
  },
  {
    id: "5",
    name: "ChatGPT Plus",
    category: "Utility",
    amount: 20.0,
    cycle: "monthly",
    status: "paused",
    renewalLabel: "RESUME_ON",
    renewalValue: "Manual",
    iconBg: "bg-secondary/10",
    iconInitial: "C",
  },
  {
    id: "6",
    name: "Amazon Web Services",
    category: "Infrastructure",
    amount: 82.51,
    amountApprox: true,
    cycle: "usage-based",
    status: "active",
    renewalLabel: "NEXT_BILLING",
    renewalValue: "Oct 1, 2024",
    iconBg: "bg-tertiary/10",
    iconInitial: "A",
  },
];

const categories = [...new Set(subscriptions.map((s) => s.category))];

const activeCount = subscriptions.filter((s) => s.status === "active").length;
const totalMonthly = subscriptions
  .filter((s) => s.status !== "paused")
  .reduce(
    (sum, s) => sum + (s.cycle === "annual" ? s.amount / 12 : s.amount),
    0
  );

export default function SubscriptionsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Next Renewal");
  const [category, setCategory] = useState("All Services");
  const [status, setStatus] = useState("Any Status");

  const filtered = useMemo(() => {
    let result = [...subscriptions];

    if (category !== "All Services") {
      result = result.filter((s) => s.category === category);
    }

    if (status !== "Any Status") {
      result = result.filter((s) => s.status === status.toLowerCase());
    }

    if (sortBy === "Name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Amount") {
      result.sort((a, b) => b.amount - a.amount);
    }
    // "Next Renewal" keeps original order (already sorted by renewal proximity)

    return result;
  }, [sortBy, category, status]);

  return (
    <FadeIn className="relative min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My Subscriptions
          </h1>
          <p className="text-sm text-muted mt-1">
            Managing{" "}
            <span className="text-primary font-semibold">
              {activeCount} active
            </span>{" "}
            services costing{" "}
            <span className="text-primary font-semibold font-mono">
              ${totalMonthly.toFixed(2)}/mo
            </span>
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* Filters */}
      <SubscriptionFilters
        sortBy={sortBy}
        category={category}
        status={status}
        categories={categories}
        onSortChange={setSortBy}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
      />

      {/* Grid / List */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
            : "flex flex-col gap-3 mt-6"
        }
      >
        {filtered.length > 0 ? (
          filtered.map((sub, i) => (
            <SubscriptionCard key={sub.id} subscription={sub} index={i} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted text-sm py-16">
            No subscriptions match the selected filters.
          </p>
        )}
      </div>

      <Fab />
    </FadeIn>
  );
}
