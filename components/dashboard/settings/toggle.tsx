"use client";

import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface ToggleProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({
  label,
  description,
  defaultChecked = false,
  checked,
  onChange,
  disabled = false,
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;

  function handleChange(v: boolean) {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  }

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p
          className={cn(
            "text-base font-bold",
            disabled ? "text-muted" : "text-foreground"
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-sm text-muted mt-0.5">{description}</p>
        )}
      </div>
      <Switch.Root
        checked={on}
        onCheckedChange={handleChange}
        disabled={disabled}
        className={cn(
          "relative w-14 h-7 rounded-full transition-colors duration-200 shrink-0 outline-none",
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
          on ? "bg-primary" : "bg-black/10"
        )}
      >
        <Switch.Thumb className="block w-5 h-5 rounded-full shadow-sm transition-transform duration-200 translate-x-1 data-[state=checked]:translate-x-8 bg-white/50 data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  );
}
