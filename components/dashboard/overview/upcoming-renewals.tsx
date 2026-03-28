"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RenewalCard } from "./renewal-card";

function getDateLabel(dateStr: string): { label: string; urgent: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  const diffDays = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return { label: "Overdue", urgent: true };
  if (diffDays === 0) return { label: "Today", urgent: true };
  if (diffDays === 1) return { label: "Tomorrow", urgent: true };
  return {
    label: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    urgent: false,
  };
}

export function UpcomingRenewals() {
  const subs = useQuery(api.subscriptions.getSubscriptions);

  const upcoming = useMemo(() => {
    if (!subs) return undefined;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);

    return subs
      .filter((s) => {
        if (s.status === "cancelled" || s.status === "paused") return false;
        if (!s.nextPaymentDate) return false;
        const due = new Date(s.nextPaymentDate + "T00:00:00");
        return due >= today && due <= in7Days;
      })
      .sort((a, b) => a.nextPaymentDate.localeCompare(b.nextPaymentDate));
  }, [subs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Next 7 Days</h2>
          <p className="text-xs text-muted mt-0.5">
            Upcoming auto-renewals you should track
          </p>
        </div>
        <Link
          href="/dashboard/calendar"
          className="text-[10px] font-bold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity mt-1"
        >
          View Calendar
        </Link>
      </div>

      {upcoming === undefined ? (
        <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-none pt-3 pl-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-64 shrink-0 h-40 bg-surface border border-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <p className="text-sm text-muted py-2">
          No renewals in the next 7 days.
        </p>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-none pt-3 pl-2">
          {upcoming.map((sub, i) => {
            const { label, urgent } = getDateLabel(sub.nextPaymentDate);
            const nextBilling = new Date(
              sub.nextPaymentDate + "T00:00:00"
            ).toLocaleDateString("en-US", { month: "short", day: "numeric" });

            return (
              <RenewalCard
                key={sub._id}
                id={sub._id}
                dateLabel={label}
                amount={sub.amount}
                currency={sub.currency}
                name={sub.name}
                nextBilling={nextBilling}
                iconColor={sub.iconColor}
                urgent={urgent}
                index={i}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
