"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowDown2 } from "iconsax-reactjs";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  /** Optional color dot (hex / rgba) shown beside the label */
  dot?: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  options,
  onChange,
  placeholder = "Select…",
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
    setOpen((o) => !o);
  }

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
        {selected?.dot && (
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: selected.dot }}
          />
        )}
        <span
          className={cn(
            "flex-1 text-left font-semibold",
            selected ? "text-foreground" : "text-muted/40"
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ArrowDown2 size={14} color="var(--color-muted)" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className="fixed z-200 bg-surface border border-border rounded-xl overflow-hidden shadow-lg max-h-60 overflow-y-auto"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-left transition-colors",
                    opt.value === value
                      ? "text-primary bg-primary/10"
                      : "text-muted hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {opt.dot && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: opt.dot }}
                    />
                  )}
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}
