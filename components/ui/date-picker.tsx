"use client";

import { useRef, useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function toDate(value: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return isNaN(d.getTime()) ? undefined : d;
}

function toIso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function formatDisplay(value: string): string {
  const d = toDate(value);
  if (!d) return "";
  return format(d, "MMM d, yyyy");
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, openUp: false });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        popoverRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const popoverHeight = 320;
      const openUp = spaceBelow < popoverHeight;
      setCoords({
        top: openUp ? rect.top - popoverHeight - 6 : rect.bottom + 6,
        left: rect.left,
        openUp,
      });
    }
    setOpen((o) => !o);
  }

  const selected = toDate(value);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          "w-full flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 text-sm transition-colors hover:border-primary/40 focus:outline-none",
          open && "border-primary/50",
          className
        )}
      >
        <Calendar size={15} color="var(--color-muted)" variant="Bold" />
        <span
          className={cn(
            "flex-1 text-left font-semibold",
            value ? "text-foreground" : "text-muted/40"
          )}
        >
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-200 bg-surface border border-border rounded-2xl shadow-xl p-3"
          >
            <DayPicker
              mode="single"
              selected={selected}
              captionLayout="dropdown"
              startMonth={new Date(new Date().getFullYear() - 10, 0)}
              endMonth={new Date(new Date().getFullYear() + 10, 11)}
              onSelect={(date) => {
                if (date) {
                  onChange(toIso(date));
                  setOpen(false);
                }
              }}
              classNames={{
                root: "text-sm",
                months: "flex flex-col",
                month: "flex flex-col gap-3",
                month_caption: "flex items-center justify-between px-1 py-1",
                caption_label: "hidden",
                dropdowns: "flex items-center gap-2 flex-1",
                dropdown:
                  "bg-neutral border border-border rounded-lg px-2 py-1.5 text-sm font-semibold text-foreground outline-none focus:border-primary/50 cursor-pointer appearance-none",
                dropdown_root: "relative",
                nav: "flex items-center gap-1",
                button_previous:
                  "w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-white/5 transition-colors",
                button_next:
                  "w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-white/5 transition-colors",
                weekdays: "grid grid-cols-7 mb-1",
                weekday:
                  "text-center text-[10px] font-bold tracking-widest uppercase text-muted py-1",
                weeks: "flex flex-col gap-0.5",
                week: "grid grid-cols-7",
                day: "flex items-center justify-center",
                day_button:
                  "w-8 h-8 rounded-lg text-sm font-semibold transition-colors text-foreground hover:bg-primary/10 hover:text-primary",
                selected:
                  "[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary [&>button]:hover:text-white",
                today: "[&>button]:text-primary [&>button]:font-black",
                outside: "[&>button]:text-muted/30",
                disabled: "[&>button]:opacity-30 [&>button]:cursor-not-allowed",
              }}
              components={{
                Chevron: ({ orientation }) =>
                  orientation === "left" ? (
                    <ArrowLeft2 size={14} color="currentColor" />
                  ) : (
                    <ArrowRight2 size={14} color="currentColor" />
                  ),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
