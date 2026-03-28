"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatAmount } from "@/lib/currency";

export function InsightCard() {
  const subs = useQuery(api.subscriptions.getSubscriptions);
  const user = useQuery(api.users.getCurrentUser);
  const userCurrency = user?.currency ?? "USD";

  const insight = useMemo(() => {
    if (!subs) return null;

    const rarelySubs = subs.filter(
      (s) => s.usageFrequency === "rarely" && s.status === "active"
    );

    if (rarelySubs.length > 0) {
      const savings = rarelySubs.reduce((sum, s) => sum + s.amount, 0);
      return {
        type: "rarely" as const,
        message: `You have ${rarelySubs.length} subscription${rarelySubs.length !== 1 ? "s" : ""} you rarely use. Cancelling them could save you ${formatAmount(savings, userCurrency)}/mo.`,
      };
    }

    const activeSubs = subs.filter(
      (s) => s.status === "active" || s.status === "trial"
    );
    if (activeSubs.length > 0) {
      return {
        type: "generic" as const,
        message: `You're tracking ${activeSubs.length} subscription${activeSubs.length !== 1 ? "s" : ""}. Mark underused ones as "rarely used" in their settings to get savings insights here.`,
      };
    }

    return {
      type: "empty" as const,
      message:
        "Add your first subscription to start getting personalised insights.",
    };
  }, [subs, userCurrency]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
      className="bg-primary rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-white">Subsense Insight</h3>
        {subs === undefined ? (
          <div className="animate-pulse flex flex-col gap-2">
            <div className="h-3 w-full bg-white/20 rounded" />
            <div className="h-3 w-3/4 bg-white/15 rounded" />
          </div>
        ) : (
          <p className="text-sm text-white/75 leading-relaxed">
            {insight?.message}
          </p>
        )}
      </div>

      <Link
        href="/dashboard/subscriptions"
        className="w-full bg-white/90 hover:bg-white transition-colors text-neutral font-bold text-sm py-2.5 rounded-xl text-center"
      >
        {insight?.type === "rarely"
          ? "Review Subscriptions"
          : "Manage Subscriptions"}
      </Link>
    </motion.div>
  );
}
