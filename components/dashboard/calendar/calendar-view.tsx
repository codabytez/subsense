"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";
import {
  CalendarGrid,
  DueTodayPanel,
  ProjectionCard,
  WeeklyCashFlow,
} from "@/components/dashboard/calendar";
import {
  EVENTS,
  type CalendarView,
  type CalendarEvent,
} from "@/components/dashboard/calendar/calendar-grid";

const VIEWS: CalendarView[] = ["Week", "Month", "Year"];

export function CalendarView() {
  const [view, setView] = useState<CalendarView>("Month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>(
    () => EVENTS[new Date().getDate()] ?? []
  );

  function handleDaySelect(date: Date, events: CalendarEvent[]) {
    setSelectedDate(date);
    setSelectedEvents(events);
  }

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
        <CalendarGrid view={view} onDaySelect={handleDaySelect} />

        <div className="flex flex-col gap-4">
          <DueTodayPanel events={selectedEvents} date={selectedDate} />
          <ProjectionCard />
        </div>
      </div>

      {/* Weekly cash flow */}
      <WeeklyCashFlow />
    </FadeIn>
  );
}
