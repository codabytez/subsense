"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  addDays,
  format,
  isSameMonth,
  isSameYear,
  startOfWeek,
} from "date-fns";
import type { Doc } from "@/convex/_generated/dataModel";
import { toDateKey } from "./calendar-grid";

const CHART_H = 300;
const LABEL_H = 28;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDays(weekOffset: number): Date[] {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, weekOffset * 7 + i)
  );
}

function formatWeekRange(days: Date[]) {
  const start = days[0];
  const end = days[6];
  const sameMonth = isSameMonth(start, end);
  const sameYear = isSameYear(start, end);
  const startLabel = format(start, "MMM d");
  const endLabel = format(
    end,
    `${sameMonth ? "" : "MMM "}d${sameYear ? "" : ", yyyy"}`
  );
  return `${startLabel} - ${endLabel}`;
}

function toH(amount: number, max: number) {
  if (!amount || max === 0) return 0;
  return Math.max(8, Math.round((amount / max) * CHART_H));
}

interface WeeklyCashFlowProps {
  subs: Doc<"subscriptions">[] | undefined;
}

export function WeeklyCashFlow({ subs }: WeeklyCashFlowProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const weekRangeLabel = useMemo(() => formatWeekRange(weekDays), [weekDays]);

  const days = useMemo(() => {
    if (!subs) return null;
    return weekDays.map((d, i) => {
      const key = toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEvents = subs.filter(
        (s) =>
          s.nextPaymentDate === key &&
          s.status !== "cancelled" &&
          s.status !== "paused" &&
          s.status !== "expired" &&
          s.status !== "lapsed" &&
          s.cycle !== "one-off"
      );
      const fixed = dayEvents
        .filter((s) => s.paymentMode === "auto")
        .reduce((sum, s) => sum + s.amount, 0);
      const variable = dayEvents
        .filter((s) => s.paymentMode === "manual")
        .reduce((sum, s) => sum + s.amount, 0);
      return { label: DAY_LABELS[i], fixed, variable };
    });
  }, [subs, weekDays]);

  const max = days
    ? Math.max(...days.flatMap((d) => [d.fixed, d.variable]), 0)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
      className="bg-surface border border-border rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Weekly Cash Flow
          </h2>
          <p className="text-sm text-muted mt-0.5">
            Daily distribution of subscription costs by week
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-background px-1 py-1">
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="h-8 w-8 rounded-lg text-foreground hover:bg-surface transition-colors"
              aria-label="Previous week"
            >
              &lt;
            </button>
            <p className="min-w-28 px-1 text-center text-[11px] font-semibold text-muted">
              {weekRangeLabel}
            </p>
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="h-8 w-8 rounded-lg text-foreground hover:bg-surface transition-colors"
              aria-label="Next week"
            >
              &gt;
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
              }}
            />
            <span className="text-xs text-muted font-medium">Auto-Pay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "var(--color-secondary)",
              }}
            />
            <span className="text-xs text-muted font-medium">Manual</span>
          </div>
        </div>
      </div>

      {/* Skeleton while loading */}
      {!days ? (
        <div className="animate-pulse flex gap-3 items-end min-h-70">
          {[40, 120, 20, 80, 30, 20, 90].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                className="w-full bg-white/10 rounded-t"
                style={{ height: h }}
              />
              <div className="h-3 w-6 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 items-end min-h-70">
          {days.map((d, i) => {
            const fixedH = toH(d.fixed, max);
            const varH = toH(d.variable, max);
            const hasBoth = d.fixed > 0 && d.variable > 0;

            return (
              <div
                key={d.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: CHART_H,
                  }}
                >
                  {/* Auto-Pay bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: d.fixed > 0 ? fixedH : 6 }}
                    transition={{
                      delay: 0.3 + i * 0.07,
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: hasBoth ? "50%" : "100%",
                      borderRadius: hasBoth ? "4px 0 0 0" : "4px 4px 0 0",
                      backgroundColor:
                        d.fixed > 0
                          ? "var(--color-primary)"
                          : "rgba(255,255,255,0.06)",
                    }}
                  />
                  {/* Manual bar */}
                  {d.variable > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: varH }}
                      transition={{
                        delay: 0.35 + i * 0.07,
                        duration: 0.55,
                        ease: "easeOut",
                      }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: hasBoth ? "50%" : 0,
                        width: hasBoth ? "50%" : "100%",
                        borderRadius: hasBoth ? "0 4px 0 0" : "4px 4px 0 0",
                        backgroundColor: "var(--color-secondary)",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--color-muted)",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    height: LABEL_H,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
