"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";
import {
  CalendarGrid,
  DueTodayPanel,
  ProjectionCard,
  WeeklyCashFlow,
} from "@/components/dashboard/calendar";
import {
  type CalendarView,
  type CalendarEvent,
  toDateKey,
} from "@/components/dashboard/calendar/calendar-grid";

const VIEWS: CalendarView[] = ["Week", "Month", "Year"];

function solidColor(rgba: string): string {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? `rgb(${m[1]},${m[2]},${m[3]})` : "#7c5cfc";
}

function buildEventsMap(
  subs: Doc<"subscriptions">[]
): Record<string, CalendarEvent[]> {
  const map: Record<string, CalendarEvent[]> = {};
  for (const sub of subs) {
    if (sub.status === "cancelled" || sub.status === "paused") continue;
    if (!sub.nextPaymentDate) continue;
    const key = sub.nextPaymentDate; // already "YYYY-MM-DD"
    if (!map[key]) map[key] = [];
    map[key].push({
      id: sub._id,
      name: sub.name,
      dotColor: solidColor(sub.iconColor),
      amount: sub.amount,
      currency: sub.currency,
      cycle: sub.cycle,
      paymentMode: sub.paymentMode,
      iconColor: sub.iconColor,
      paymentMethodId: sub.paymentMethodId,
      notes: sub.notes,
    });
  }
  return map;
}

export function CalendarView() {
  const [view, setView] = useState<CalendarView>("Month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const subs = useQuery(api.subscriptions.getSubscriptions);
  const user = useQuery(api.users.getCurrentUser);

  const eventsMap = useMemo(() => {
    if (!subs) return {};
    return buildEventsMap(subs);
  }, [subs]);

  const selectedEvents = useMemo((): CalendarEvent[] => {
    if (!selectedDate) return [];
    const key = toDateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    return eventsMap[key] ?? [];
  }, [selectedDate, eventsMap]);

  const userCurrency = user?.currency ?? "USD";

  return (
    <FadeIn className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Payment Calendar
          </h1>
          <p className="text-sm text-muted mt-1">
            Visualize your recurring commitments
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-surface border border-border rounded-xl p-1 shrink-0">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "relative px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-colors duration-200",
                view === v ? "text-primary" : "text-muted hover:text-foreground"
              )}
            >
              {view === v && (
                <motion.span
                  layoutId="cal-view-pill"
                  className="absolute inset-0 rounded-sm"
                  style={{
                    backgroundColor: "rgba(124,92,252,0.15)",
                    border: "1px solid rgba(124,92,252,0.25)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{v}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main layout: calendar + right panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <CalendarGrid
          view={view}
          eventsMap={eventsMap}
          onDaySelect={setSelectedDate}
        />

        <div className="flex flex-col gap-4">
          <DueTodayPanel events={selectedEvents} date={selectedDate} />
          <ProjectionCard subs={subs} userCurrency={userCurrency} />
        </div>
      </div>

      {/* Weekly cash flow */}
      <WeeklyCashFlow subs={subs} />
    </FadeIn>
  );
}
