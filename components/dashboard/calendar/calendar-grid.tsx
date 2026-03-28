"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/lib/currency";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WEEKDAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export interface CalendarEvent {
  id: string;
  name: string;
  dotColor: string;
  amount: number;
  currency: string;
  cycle: string;
  paymentMode: "auto" | "manual";
  iconColor: string;
  paymentMethodId?: string;
  notes?: string;
}

/** Converts an rgb() string to rgba() with the given alpha (0–1). */
function withAlpha(rgb: string, alpha: number): string {
  const m = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  return m ? `rgba(${m[1]},${m[2]},${m[3]},${alpha})` : rgb;
}

/** Returns a "YYYY-MM-DD" key from year/month(0-indexed)/day. Safe for local timezone. */
export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getCalendarDays(year: number, month: number) {
  const rawFirstDay = new Date(year, month, 1).getDay();
  const startOffset = (rawFirstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days: { day: number; thisMonth: boolean }[] = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, thisMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, thisMonth: true });
  }
  let next = 1;
  while (days.length < 42) {
    days.push({ day: next++, thisMonth: false });
  }
  return days;
}

function getWeekDays(date: Date) {
  const day = (date.getDay() + 6) % 7; // Mon = 0
  const mon = new Date(date);
  mon.setDate(date.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

interface CalendarGridProps {
  view: CalendarView;
  eventsMap: Record<string, CalendarEvent[]>;
  onDaySelect?: (date: Date) => void;
}

export function CalendarGrid({
  view,
  eventsMap,
  onDaySelect,
}: CalendarGridProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [weekAnchor, setWeekAnchor] = useState(new Date(today));
  const [selected, setSelected] = useState<number | null>(today.getDate());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(today)
  );

  function handleSelect(date: Date) {
    setSelectedDate(date);
    onDaySelect?.(date);
  }

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  function prev() {
    if (view === "Week") {
      const d = new Date(weekAnchor);
      d.setDate(d.getDate() - 7);
      setWeekAnchor(d);
    } else if (view === "Month") {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
      setSelected(null);
    } else {
      setYear((y) => y - 1);
    }
  }

  function next() {
    if (view === "Week") {
      const d = new Date(weekAnchor);
      d.setDate(d.getDate() + 7);
      setWeekAnchor(d);
    } else if (view === "Month") {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
      setSelected(null);
    } else {
      setYear((y) => y + 1);
    }
  }

  function headerLabel() {
    if (view === "Week") {
      const weekDays = getWeekDays(weekAnchor);
      const first = weekDays[0];
      const last = weekDays[6];
      if (first.getMonth() === last.getMonth()) {
        return `${MONTH_NAMES[first.getMonth()]} ${first.getFullYear()}`;
      }
      return `${MONTH_SHORT[first.getMonth()]} – ${MONTH_SHORT[last.getMonth()]} ${last.getFullYear()}`;
    }
    if (view === "Year") return `${year}`;
    return `${MONTH_NAMES[month]} ${year}`;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden h-max">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-2xl font-bold text-foreground">{headerLabel()}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft2 size={18} color="currentColor" />
          </button>
          <button
            onClick={next}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-colors"
          >
            <ArrowRight2 size={18} color="currentColor" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "Month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <MonthView
              year={year}
              month={month}
              today={today}
              isCurrentMonth={isCurrentMonth}
              selected={selected}
              eventsMap={eventsMap}
              onSelect={(day) => {
                setSelected(day);
                handleSelect(new Date(year, month, day));
              }}
            />
          </motion.div>
        )}
        {view === "Week" && (
          <motion.div
            key="week"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <WeekView
              weekAnchor={weekAnchor}
              today={today}
              selectedDate={selectedDate}
              eventsMap={eventsMap}
              onSelect={handleSelect}
            />
          </motion.div>
        )}
        {view === "Year" && (
          <motion.div
            key="year"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <YearView
              year={year}
              today={today}
              selectedDate={selectedDate}
              eventsMap={eventsMap}
              onSelect={handleSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Month View ─── */
function MonthView({
  year,
  month,
  today,
  isCurrentMonth,
  selected,
  eventsMap,
  onSelect,
}: {
  year: number;
  month: number;
  today: Date;
  isCurrentMonth: boolean;
  selected: number | null;
  eventsMap: Record<string, CalendarEvent[]>;
  onSelect: (d: number) => void;
}) {
  const days = getCalendarDays(year, month);
  return (
    <>
      <div className="grid grid-cols-7 border-t border-border">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-bold tracking-widest text-muted py-3"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-t border-l border-border">
        {days.map((item, i) => {
          const events = item.thisMonth
            ? (eventsMap[toDateKey(year, month, item.day)] ?? [])
            : [];
          const isToday =
            isCurrentMonth && item.thisMonth && item.day === today.getDate();
          const isSel = item.thisMonth && item.day === selected;
          return (
            <div
              key={i}
              onClick={() => item.thisMonth && onSelect(item.day)}
              className={cn(
                "relative border-r border-b border-border flex flex-col p-3 transition-colors min-h-28",
                item.thisMonth ? "cursor-pointer" : "cursor-default"
              )}
              style={
                isSel
                  ? { boxShadow: "inset 0 0 0 2px var(--color-primary)" }
                  : undefined
              }
            >
              <span
                className={cn(
                  "text-xl font-bold leading-none w-9 h-9 flex items-center justify-center rounded-full shrink-0 self-start",
                  isToday
                    ? "bg-primary text-white"
                    : item.thisMonth
                      ? "text-foreground"
                      : "text-muted opacity-30"
                )}
              >
                {item.day}
              </span>
              {events.length > 0 && (
                <div className="flex flex-col gap-0.5 mt-2 w-full overflow-hidden">
                  {events.slice(0, 3).map((e, ei) => (
                    <span
                      key={ei}
                      className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded truncate block backdrop-blur-sm"
                      style={{
                        backgroundColor: withAlpha(e.dotColor, 0.12),
                        color: e.dotColor,
                        border: `1px solid ${withAlpha(e.dotColor, 0.3)}`,
                        boxShadow: `0 1px 4px ${withAlpha(e.dotColor, 0.15)}`,
                      }}
                    >
                      {e.name}
                    </span>
                  ))}
                  {events.length > 3 && (
                    <span className="text-[9px] font-bold text-muted shrink-0">
                      +{events.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─── Week View ─── */
function WeekView({
  weekAnchor,
  today,
  selectedDate,
  eventsMap,
  onSelect,
}: {
  weekAnchor: Date;
  today: Date;
  selectedDate: Date | null;
  eventsMap: Record<string, CalendarEvent[]>;
  onSelect: (date: Date) => void;
}) {
  const weekDays = getWeekDays(weekAnchor);
  return (
    <>
      <div className="grid grid-cols-7 border-t border-border">
        {weekDays.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString();
          return (
            <div key={i} className="flex flex-col items-center py-3 gap-1">
              <span className="text-[11px] font-bold tracking-widest text-muted">
                {WEEKDAYS_SHORT[i]}
              </span>
              <span
                className={cn(
                  "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full",
                  isToday ? "bg-primary text-white" : "text-foreground"
                )}
              >
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7 border-t border-l border-border">
        {weekDays.map((d, i) => {
          const events =
            eventsMap[toDateKey(d.getFullYear(), d.getMonth(), d.getDate())] ??
            [];
          const isToday = d.toDateString() === today.toDateString();
          const isSel = selectedDate?.toDateString() === d.toDateString();
          return (
            <div
              key={i}
              onClick={() => onSelect(d)}
              className={cn(
                "border-r border-b border-border p-3 min-h-48 flex flex-col gap-2 cursor-pointer",
                isToday && "bg-primary/5"
              )}
              style={
                isSel && !isToday
                  ? { boxShadow: "inset 0 0 0 2px var(--color-primary)" }
                  : isToday
                    ? { boxShadow: "inset 0 0 0 2px var(--color-primary)" }
                    : undefined
              }
            >
              {events.slice(0, 3).map((e, ei) => (
                <div
                  key={ei}
                  className="px-2 py-1.5 rounded text-[10px] font-bold tracking-wide backdrop-blur-sm"
                  style={{
                    backgroundColor: withAlpha(e.dotColor, 0.12),
                    color: e.dotColor,
                    border: `1px solid ${withAlpha(e.dotColor, 0.3)}`,
                    boxShadow: `0 2px 8px ${withAlpha(e.dotColor, 0.15)}`,
                  }}
                >
                  <p className="uppercase tracking-widest">{e.name}</p>
                  <p className="font-mono mt-0.5 opacity-80">
                    {formatAmount(e.amount, e.currency)}
                  </p>
                </div>
              ))}
              {events.length > 3 && (
                <span className="text-[9px] font-bold text-muted">
                  +{events.length - 3}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─── Year View ─── */
function YearView({
  year,
  today,
  selectedDate,
  eventsMap,
  onSelect,
}: {
  year: number;
  today: Date;
  selectedDate: Date | null;
  eventsMap: Record<string, CalendarEvent[]>;
  onSelect: (date: Date) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-px border-t border-border bg-border p-px">
      {Array.from({ length: 12 }, (_, m) => {
        const days = getCalendarDays(year, m);
        const isCurrentMonth =
          year === today.getFullYear() && m === today.getMonth();
        return (
          <div key={m} className="bg-surface p-4">
            <p
              className={cn(
                "text-xs font-bold mb-3",
                isCurrentMonth ? "text-primary" : "text-foreground"
              )}
            >
              {MONTH_SHORT[m]}
            </p>
            <div className="grid grid-cols-7 gap-y-0.5">
              {WEEKDAYS_SHORT.map((d, i) => (
                <div
                  key={i}
                  className="text-center text-[8px] text-muted font-semibold py-0.5"
                >
                  {d}
                </div>
              ))}
              {days.map((item, i) => {
                const events = item.thisMonth
                  ? (eventsMap[toDateKey(year, m, item.day)] ?? [])
                  : [];
                const isToday =
                  isCurrentMonth &&
                  item.thisMonth &&
                  item.day === today.getDate();
                const isSel =
                  item.thisMonth &&
                  selectedDate?.getFullYear() === year &&
                  selectedDate?.getMonth() === m &&
                  selectedDate?.getDate() === item.day;
                return (
                  <div
                    key={i}
                    onClick={() =>
                      item.thisMonth && onSelect(new Date(year, m, item.day))
                    }
                    className={cn(
                      "flex flex-col items-center justify-center aspect-square gap-0.5",
                      item.thisMonth ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[9px] font-semibold w-5 h-5 flex items-center justify-center rounded-full shrink-0",
                        isToday
                          ? "bg-primary text-white"
                          : isSel
                            ? "bg-primary/20 text-primary"
                            : item.thisMonth
                              ? "text-foreground"
                              : "text-muted opacity-20"
                      )}
                    >
                      {item.day}
                    </span>
                    {events.length > 0 && (
                      <div className="flex items-center gap-px">
                        {events.slice(0, 3).map((e, ei) => (
                          <span
                            key={ei}
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{
                              backgroundColor: isToday
                                ? "rgba(255,255,255,0.7)"
                                : e.dotColor,
                            }}
                          />
                        ))}
                        {events.length > 3 && (
                          <span className="text-[6px] font-bold text-muted leading-none ml-px">
                            +{events.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
