"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowDown2 } from "iconsax-reactjs";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: {
    button: "px-3 py-1.5 text-[10px] rounded-lg gap-1",
    icon: 10,
    option: "px-3 py-2 text-[10px]",
  },
  md: {
    button: "px-4 py-2 text-xs rounded-xl gap-1.5",
    icon: 12,
    option: "px-4 py-2.5 text-xs",
  },
  lg: {
    button: "px-4 py-3.5 text-sm rounded-xl gap-2 w-full",
    icon: 15,
    option: "px-4 py-3 text-sm",
  },
};

export function FilterChip({
  label,
  value,
  options,
  onChange,
  size = "md",
}: FilterChipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const s = sizeStyles[size];

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
        onClick={handleOpen}
        className={cn(
          "flex items-center bg-surface border border-border whitespace-nowrap hover:border-primary/40 transition-colors duration-200",
          s.button
        )}
      >
        {label && (
          <span className="text-muted font-medium tracking-widest uppercase">
            {label}:
          </span>
        )}
        <span className="text-foreground font-semibold tracking-widest uppercase flex-1 text-left">
          {value}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ArrowDown2 size={s.icon} color="var(--color-muted)" />
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
              minWidth: size === "lg" ? coords.width : 160,
            }}
            className="fixed z-50 bg-surface border border-border rounded-xl overflow-hidden shadow-lg"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left font-semibold tracking-widest uppercase transition-colors duration-150",
                    s.option,
                    opt === value
                      ? "text-primary bg-primary/10"
                      : "text-muted hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {opt}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}
