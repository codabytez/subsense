"use client";

import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Toggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-base font-bold text-foreground">{label}</p>
        {description && (
          <p className="text-sm text-muted mt-0.5">{description}</p>
        )}
      </div>
      <Switch.Root
        checked={on}
        onCheckedChange={setOn}
        className={cn(
          "relative w-14 h-7 rounded-full transition-colors duration-200 shrink-0 outline-none",
          on ? "bg-primary" : "bg-white/15"
        )}
      >
        <Switch.Thumb className="block w-5 h-5 rounded-full shadow-sm transition-transform duration-200 translate-x-1 data-[state=checked]:translate-x-8 bg-white/50 data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  );
}
