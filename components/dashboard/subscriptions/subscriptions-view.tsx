"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { FadeIn } from "@/components/motion";
import {
  SubscriptionCard,
  SubscriptionFilters,
  SubscriptionFormModal,
} from "@/components/dashboard/subscriptions";
import { ViewToggle, Fab } from "@/components/ui";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatAmount } from "@/lib/currency";

// ── Helpers ───────────────────────────────────────────────────

function iconInitialFromName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getRenewal(sub: Doc<"subscriptions">): {
  renewalLabel: RenewalLabel;
  renewalValue: string;
  renewalUrgent: boolean;
} {
  if (sub.status === "paused") {
    return {
      renewalLabel: "RESUME_ON",
      renewalValue: "Paused",
      renewalUrgent: false,
    };
  }
  if (sub.status === "cancelled") {
    return {
      renewalLabel: "NEXT_BILLING",
      renewalValue: "Cancelled",
      renewalUrgent: false,
    };
  }
  if (sub.status === "lapsed") {
    return {
      renewalLabel: "NEXT_BILLING",
      renewalValue: "Lapsed",
      renewalUrgent: true,
    };
  }
  if (sub.status === "expired") {
    return {
      renewalLabel: "EXPIRES_IN",
      renewalValue: "Expired",
      renewalUrgent: false,
    };
  }

  if (!sub.nextPaymentDate) {
    return {
      renewalLabel: "RENEWS_IN",
      renewalValue: "—",
      renewalUrgent: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(sub.nextPaymentDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  const isOneOff = sub.cycle === "one-off";
  const label: RenewalLabel = isOneOff
    ? "EXPIRES_IN"
    : sub.status === "trial"
      ? "TRIAL_ENDS"
      : "RENEWS_IN";

  if (diffDays < 0) {
    return {
      renewalLabel: label,
      renewalValue: isOneOff ? "Expired" : "Overdue",
      renewalUrgent: true,
    };
  }
  if (diffDays === 0) {
    return { renewalLabel: label, renewalValue: "Today", renewalUrgent: true };
  }
  if (diffDays <= 7) {
    return {
      renewalLabel: label,
      renewalValue: `${diffDays} Day${diffDays === 1 ? "" : "s"}`,
      renewalUrgent: diffDays <= 3,
    };
  }

  const formatted = due.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: due.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
  return { renewalLabel: label, renewalValue: formatted, renewalUrgent: false };
}

function toCardShape(sub: Doc<"subscriptions">): Subscription {
  const { renewalLabel, renewalValue, renewalUrgent } = getRenewal(sub);
  return {
    id: sub._id,
    name: sub.name,
    plan: sub.plan,
    category: sub.category,
    amount: sub.amount,
    amountApprox: sub.amountApprox,
    cycle: sub.cycle,
    status: sub.status,
    nextPaymentDate: sub.nextPaymentDate,
    renewalLabel,
    renewalValue,
    renewalUrgent,
    currency: sub.currency,
    iconColor: sub.iconColor,
    iconInitial: iconInitialFromName(sub.name),
    paymentMode: sub.paymentMode,
    remindersEnabled: sub.remindersEnabled,
    reminderIntervals: sub.reminderIntervals,
    vaultNotes: sub.notes,
  };
}

// ── Component ─────────────────────────────────────────────────

export function SubscriptionsView() {
  const rawSubs = useQuery(api.subscriptions.getSubscriptions);
  const user = useQuery(api.users.getCurrentUser);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("Next Renewal");
  const [category, setCategory] = useState("All Services");
  const [status, setStatus] = useState("Any Status");
  const [showForm, setShowForm] = useState(false);

  const subscriptions = useMemo(
    () => (rawSubs ?? []).map(toCardShape),
    [rawSubs]
  );

  const categories = useMemo(
    () => [...new Set(subscriptions.map((s) => s.category))],
    [subscriptions]
  );

  const activeCount = subscriptions.filter((s) => s.status === "active").length;

  const totalMonthly = subscriptions
    .filter(
      (s) =>
        s.status !== "paused" &&
        s.status !== "cancelled" &&
        s.status !== "expired" &&
        s.status !== "lapsed" &&
        s.cycle !== "one-off"
    )
    .reduce((sum, s) => {
      if (s.cycle === "annual") return sum + s.amount / 12;
      if (s.cycle === "weekly") return sum + s.amount * 4.33;
      return sum + s.amount;
    }, 0);

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

    return result;
  }, [subscriptions, sortBy, category, status]);

  const isLoading = rawSubs === undefined;

  return (
    <FadeIn className="relative min-h-full">
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            My Subscriptions
          </h1>
          <p className="text-sm text-muted mt-1">
            {isLoading ? (
              ""
            ) : subscriptions.length === 0 ? (
              "Your vault is empty — add your first subscription."
            ) : (
              <>
                Managing{" "}
                <span className="text-primary font-semibold">
                  {activeCount} active
                </span>{" "}
                services costing{" "}
                <span className="text-primary font-semibold font-mono">
                  {formatAmount(totalMonthly, user?.currency, false)}/mo
                </span>
              </>
            )}
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
      {isLoading ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
              : "flex flex-col gap-3 mt-6"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={
                view === "grid"
                  ? "h-44 rounded-2xl bg-surface border border-border animate-pulse"
                  : "h-16 rounded-xl bg-surface border border-border animate-pulse"
              }
            />
          ))}
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
              : "flex flex-col gap-3 mt-6"
          }
        >
          {subscriptions.length === 0 ? (
            <p className="col-span-full text-center text-muted text-sm py-16">
              No subscriptions yet — add your first one.
            </p>
          ) : filtered.length === 0 ? (
            <p className="col-span-full text-center text-muted text-sm py-16">
              No subscriptions match the selected filters.
            </p>
          ) : (
            filtered.map((sub, i) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                index={i}
                view={view}
              />
            ))
          )}
        </div>
      )}

      <Fab onClick={() => setShowForm(true)} />

      <SubscriptionFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </FadeIn>
  );
}
