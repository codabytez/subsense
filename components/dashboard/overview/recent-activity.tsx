"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { VideoPlay, MagicStar, Scissor, Cloud } from "iconsax-reactjs";

const activities = [
  {
    id: "1",
    name: "YouTube Premium",
    sub: "Processed via Card ending in 4242",
    amount: 18.99,
    date: "OCT 12, 10:45 AM",
    icon: VideoPlay,
    iconBg: "bg-primary/20",
    iconColor: "var(--color-primary)",
  },
  {
    id: "2",
    name: "ChatGPT Plus",
    sub: "Recurring Billing",
    amount: 20.0,
    date: "OCT 11, 04:20 PM",
    icon: MagicStar,
    iconBg: "bg-tertiary/20",
    iconColor: "var(--color-tertiary)",
  },
  {
    id: "3",
    name: "Equinox Membership",
    sub: "Monthly Plan",
    amount: 165.0,
    date: "OCT 10, 09:00 AM",
    icon: Scissor,
    iconBg: "bg-secondary/20",
    iconColor: "var(--color-secondary)",
  },
  {
    id: "4",
    name: "iCloud+ 2TB",
    sub: "Family Sharing",
    amount: 9.99,
    date: "OCT 09, 12:15 PM",
    icon: Cloud,
    iconBg: "bg-muted/20",
    iconColor: "var(--color-muted)",
  },
];

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
      className="bg-surface border border-border rounded-2xl p-1 flex flex-col gap-4 h-min"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
        <button className="text-xs font-medium text-muted hover:text-foreground transition-colors">
          Export CSV
        </button>
      </div>

      {/* List */}
      <ul className="flex flex-col divide-y divide-border px-5">
        {activities.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3 + i * 0.07,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <Link
                href={`/dashboard/subscriptions/${item.id}`}
                className="flex items-center gap-3 py-3.5 hover:opacity-80 transition-opacity"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                >
                  <Icon size={18} color={item.iconColor} variant="Bold" />
                </div>

                {/* Name + sub */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted truncate mt-0.5">
                    {item.sub}
                  </p>
                </div>

                {/* Amount + date */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground font-mono">
                    -${item.amount.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wide">
                    {item.date}
                  </p>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Show more */}
      <button className="w-full rounded-xl py-4 bg-background text-sm font-semibold text-primary hover:opacity-80 transition-opacity text-center">
        Show More History
      </button>
    </motion.div>
  );
}
