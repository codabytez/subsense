"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FadeIn } from "@/components/motion";
import {
  MonthlyBurn,
  UpcomingRenewals,
  StatsPanel,
  RecentActivity,
  InsightCard,
} from "@/components/dashboard/overview";
import { SubscriptionFormModal } from "@/components/dashboard/subscriptions";
import { Add, Calendar, Chart, Notification } from "iconsax-reactjs";

const FEATURES = [
  {
    icon: Chart,
    title: "Track spending",
    description: "See your monthly burn rate and spending by category.",
  },
  {
    icon: Calendar,
    title: "Never miss a renewal",
    description: "Get reminded before every billing date.",
  },
  {
    icon: Notification,
    title: "Stay on top",
    description: "Inbox alerts for upcoming and overdue payments.",
  },
];

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <FadeIn className="flex flex-col items-center justify-center gap-10 py-16 text-center">
      {/* Icon */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center"
        style={{
          backgroundColor: "rgba(124,92,252,0.12)",
          border: "1px solid rgba(124,92,252,0.2)",
        }}
      >
        <Chart size={40} color="var(--color-primary)" variant="Bold" />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2 max-w-sm">
        <h2 className="text-2xl font-black text-foreground">
          You&apos;re all set up
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          Add your first subscription to start tracking your spending, renewals,
          and insights.
        </p>
      </div>

      {/* Feature pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col gap-2 bg-surface border border-border rounded-2xl p-4 text-left"
          >
            <Icon size={18} color="var(--color-primary)" variant="Bold" />
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="text-xs text-muted leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-black text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <Add size={18} color="currentColor" />
        Add your first subscription
      </button>
    </FadeIn>
  );
}

export default function OverviewPage() {
  const subs = useQuery(api.subscriptions.getSubscriptions);
  const user = useQuery(api.users.getCurrentUser);
  const [showForm, setShowForm] = useState(false);
  const [now] = useState(() => Date.now());

  const isNewUser =
    user !== undefined &&
    user !== null &&
    user._creationTime > now - 7 * 24 * 60 * 60 * 1000;

  const isEmpty = subs !== undefined && subs.length === 0;

  return (
    <>
      {isEmpty && isNewUser ? (
        <EmptyState onAdd={() => setShowForm(true)} />
      ) : isEmpty ? (
        <FadeIn className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-lg font-bold text-foreground">
            No subscriptions yet
          </p>
          <p className="text-sm text-muted">
            Add one to start tracking your spending.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black text-white hover:opacity-90 transition-opacity mt-2"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Add size={16} color="currentColor" />
            Add subscription
          </button>
        </FadeIn>
      ) : (
        <FadeIn className="flex flex-col gap-6">
          <MonthlyBurn />
          <UpcomingRenewals />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
            <div className="flex flex-col gap-4">
              <StatsPanel />
              <InsightCard />
            </div>
            <RecentActivity />
          </div>
        </FadeIn>
      )}

      <SubscriptionFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  );
}
