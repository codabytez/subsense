"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TickCircle } from "iconsax-reactjs";
import type { CalendarEvent } from "./calendar-grid";
import { PaymentConfirmModal } from "./payment-confirm-modal";
import { formatAmount } from "@/lib/currency";
import { ServiceIcon } from "@/components/ui/service-icon";

function cycleShort(cycle: string): string {
  switch (cycle) {
    case "monthly":
      return "/mo";
    case "annual":
      return "/yr";
    case "weekly":
      return "/wk";
    default:
      return "";
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function getDayLabel(date: Date | null): string {
  if (!date) return "Due Today";
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const same = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (same(date, today)) return "Due Today";
  if (same(date, tomorrow)) return "Due Tomorrow";
  if (same(date, yesterday)) return "Due Yesterday";
  return `Due on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

interface DueTodayPanelProps {
  events: CalendarEvent[];
  date: Date | null;
}

export function DueTodayPanel({ events, date }: DueTodayPanelProps) {
  const title = getDayLabel(date);

  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [modalSub, setModalSub] = useState<CalendarEvent | null>(null);

  function handleConfirm() {
    if (!modalSub) return;
    setPaidIds((prev) => new Set([...prev, modalSub.id]));
    setModalSub(null);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3"
      >
        <h3 className="text-xl font-bold text-foreground">{title}</h3>

        <AnimatePresence mode="popLayout">
          {events.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted py-2"
            >
              No subscriptions due on this day.
            </motion.p>
          ) : (
            events.map((item, i) => {
              const paid = paidIds.has(item.id);
              const isAuto = item.paymentMode === "auto";
              const isOneOff = item.isOneOff ?? false;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, delay: i * 0.05 }}
                >
                  <div
                    className="relative w-full rounded-xl"
                    style={{ opacity: paid ? 0.55 : 1 }}
                  >
                    <Link
                      href={`/dashboard/subscriptions/${item.id}`}
                      className="flex items-center gap-3 p-4 hover:opacity-90 transition-opacity rounded-xl"
                      style={{ backgroundColor: "var(--color-sidebar-active)" }}
                    >
                      {/* Icon */}
                      <ServiceIcon
                        name={item.name}
                        iconColor={item.iconColor}
                        iconInitial={getInitials(item.name)}
                        className="w-12 h-12 rounded-2xl shrink-0"
                        initialClassName="text-sm"
                      />

                      {/* Name + amount */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-xs font-mono text-muted mt-0.5">
                          {formatAmount(item.amount, item.currency)}
                          {cycleShort(item.cycle)}
                        </p>
                      </div>

                      {/* Right */}
                      {paid ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <TickCircle
                            size={18}
                            color="var(--color-secondary)"
                            variant="Bold"
                          />
                          <span className="text-xs font-bold text-secondary">
                            Paid
                          </span>
                        </div>
                      ) : isOneOff ? (
                        <span
                          className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded shrink-0"
                          style={{
                            backgroundColor: "rgba(160,160,175,0.1)",
                            color: "var(--color-muted)",
                            border: "1px solid rgba(160,160,175,0.2)",
                          }}
                        >
                          Expires
                        </span>
                      ) : isAuto ? (
                        <span
                          className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded shrink-0"
                          style={{
                            backgroundColor: "rgba(160,160,175,0.1)",
                            color: "var(--color-muted)",
                            border: "1px solid rgba(160,160,175,0.2)",
                          }}
                        >
                          Auto-Pay
                        </span>
                      ) : (
                        <span className="w-16 shrink-0" />
                      )}
                    </Link>

                    {/* Confirm button sits outside the Link */}
                    {!paid && !isAuto && !isOneOff && (
                      <button
                        onClick={() => setModalSub(item)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold tracking-wide px-3 py-2 rounded shrink-0 hover:opacity-90 transition-opacity text-white"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        <Link
          href="/dashboard/subscriptions"
          className="w-full rounded-xl py-3 mt-1 border border-border text-sm font-bold text-primary hover:opacity-80 transition-opacity text-center block"
        >
          Manage Subscriptions
        </Link>
      </motion.div>

      <PaymentConfirmModal
        sub={modalSub}
        onConfirm={handleConfirm}
        onClose={() => setModalSub(null)}
      />
    </>
  );
}
