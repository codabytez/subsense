"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatAmount } from "@/lib/currency";

function solidColor(rgba: string): string {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? `rgb(${m[1]},${m[2]},${m[3]})` : "#2a2a35";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function RecentActivity() {
  const logs = useQuery(api.paymentLogs.getRecentLogs);

  function exportCSV() {
    if (!logs || logs.length === 0) return;
    const header = "Date,Name,Amount,Currency\n";
    const rows = logs
      .map((l) => `${l.date},"${l.subName}",${l.amount},${l.currency}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

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
        <button
          onClick={exportCSV}
          disabled={!logs || logs.length === 0}
          className="text-xs font-medium text-muted hover:text-foreground transition-colors disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      {logs === undefined ? (
        <div className="animate-pulse flex flex-col divide-y divide-border px-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 py-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3 w-36 bg-white/10 rounded" />
                <div className="h-2.5 w-24 bg-white/[0.07] rounded" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="h-3 w-16 bg-white/10 rounded" />
                <div className="h-2 w-20 bg-white/[0.07] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-muted">No payment history yet.</p>
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-border px-5">
            {logs.map((log, i) => {
              const bg = solidColor(log.subIconColor);
              const initials = getInitials(log.subName);
              const date = new Date(log.date + "T00:00:00")
                .toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
                .toUpperCase();

              return (
                <motion.li
                  key={log._id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.07,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={`/dashboard/subscriptions/${log.subscriptionId}`}
                    className="flex items-center gap-3 py-3.5 hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white"
                      style={{ backgroundColor: bg }}
                    >
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {log.subName}
                      </p>
                      <p className="text-xs text-muted truncate mt-0.5">
                        Payment logged
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-foreground font-mono">
                        -{formatAmount(log.amount, log.currency)}
                      </p>
                      <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wide">
                        {date}
                      </p>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          <Link
            href="/dashboard/subscriptions"
            className="w-full rounded-xl py-4 bg-background text-sm font-semibold text-primary hover:opacity-80 transition-opacity text-center block"
          >
            View All Subscriptions
          </Link>
        </>
      )}
    </motion.div>
  );
}
