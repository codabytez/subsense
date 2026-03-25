"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RenewalCard } from "./renewal-card";

const renewals = [
  {
    id: "1",
    dateLabel: "Tomorrow",
    amount: 14.99,
    name: "Spotify Family",
    nextBilling: "Oct 14",
    iconBg: "bg-secondary/20",
    iconInitial: "S",
    urgent: true,
  },
  {
    id: "2",
    dateLabel: "Oct 16",
    amount: 19.99,
    name: "Netflix Premium",
    nextBilling: "Oct 16",
    iconBg: "bg-tertiary/20",
    iconInitial: "N",
  },
  {
    id: "3",
    dateLabel: "Oct 18",
    amount: 54.99,
    name: "Adobe All Apps",
    nextBilling: "Oct 18",
    iconBg: "bg-primary/20",
    iconInitial: "A",
  },
  {
    id: "4",
    dateLabel: "Oct 21",
    amount: 16.0,
    name: "Notion Business",
    nextBilling: "Oct 21",
    iconBg: "bg-muted/20",
    iconInitial: "N",
  },
];

export function UpcomingRenewals() {
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

      {/* Horizontal scroll */}
      <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-none pt-3 pl-2">
        {renewals.map((r, i) => (
          <RenewalCard key={r.id} {...r} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
