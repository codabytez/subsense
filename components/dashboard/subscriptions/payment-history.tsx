"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TickCircle, Trash } from "iconsax-reactjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { formatAmount } from "@/lib/currency";

const PAGE_SIZE = 5;

interface PaymentHistoryProps {
  subscriptionId: Id<"subscriptions">;
  currency: string;
}

export function PaymentHistory({
  subscriptionId,
  currency,
}: PaymentHistoryProps) {
  const logs = useQuery(api.paymentLogs.getPaymentLogs, { subscriptionId });
  const paymentMethods = useQuery(api.paymentMethods.getPaymentMethods);
  const deleteLog = useMutation(api.paymentLogs.deletePaymentLog);

  const [showAll, setShowAll] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] =
    useState<Id<"paymentLogs"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const methodMap = new Map(
    (paymentMethods ?? []).map((m) => [
      m._id,
      m.last4 ? `${m.brand ?? m.type} ···· ${m.last4}` : m.label,
    ])
  );

  async function handleDelete(id: Id<"paymentLogs">) {
    setIsDeleting(true);
    try {
      await deleteLog({ id });
      setPendingDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  }

  if (logs === undefined) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-40 bg-surface rounded" />
        <div className="h-48 bg-surface border border-border rounded-xl" />
      </div>
    );
  }

  const displayed = showAll ? logs : logs.slice(0, PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-foreground">Payment History</h2>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
            Transaction
          </span>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
            Amount
          </span>
        </div>

        {logs.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted text-center">
            No payments logged yet.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {displayed.map((log, i) => {
                const date = new Date(log.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const method = log.paymentMethodId
                  ? methodMap.get(log.paymentMethodId)
                  : undefined;
                const isPending = pendingDeleteId === log._id;

                return (
                  <motion.li
                    key={log._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.25 + i * 0.06,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="group relative"
                  >
                    <AnimatePresence mode="wait">
                      {isPending ? (
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-3 px-5 py-4"
                          style={{ backgroundColor: "rgba(249,112,102,0.05)" }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-tertiary">
                              Delete this entry?
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              This cannot be undone.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setPendingDeleteId(null)}
                              className="text-xs font-bold text-muted hover:text-foreground transition-colors px-3 py-1.5"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(log._id)}
                              disabled={isDeleting}
                              className="text-xs font-bold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80 disabled:opacity-50"
                              style={{
                                backgroundColor: "var(--color-tertiary)",
                              }}
                            >
                              {isDeleting ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="row"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-3 px-5 py-4"
                        >
                          <TickCircle
                            size={20}
                            color="var(--color-secondary)"
                            variant="Bold"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {date}
                            </p>
                            {method && (
                              <p className="text-xs text-muted mt-0.5">
                                {method}
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-foreground font-mono">
                            {formatAmount(log.amount, log.currency ?? currency)}
                          </span>
                          <button
                            onClick={() => setPendingDeleteId(log._id)}
                            className="opacity-0 group-hover:opacity-40 hover:opacity-80! transition-opacity ml-1 shrink-0"
                            aria-label="Delete log entry"
                          >
                            <Trash
                              size={15}
                              color="var(--color-tertiary)"
                              variant="Outline"
                            />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>

            {logs.length > PAGE_SIZE && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="w-full py-4 bg-background text-xs font-bold tracking-widest uppercase text-primary hover:opacity-80 transition-opacity text-center"
              >
                {showAll
                  ? "Show Less"
                  : `View All (${logs.length - PAGE_SIZE} more)`}
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
