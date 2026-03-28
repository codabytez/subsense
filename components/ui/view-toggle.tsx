"use client";

import { Element3, MenuBoard } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-200",
          view === "grid"
            ? "bg-background text-foreground"
            : "text-muted hover:text-foreground"
        )}
      >
        <Element3
          size={14}
          variant={view === "grid" ? "Bold" : "Outline"}
          color="currentColor"
        />
        <span className="hidden sm:inline">Grid</span>
      </button>

      <button
        onClick={() => onChange("list")}
        className={cn(
          "flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-200",
          view === "list"
            ? "bg-background text-foreground"
            : "text-muted hover:text-foreground"
        )}
      >
        <MenuBoard
          size={14}
          variant={view === "list" ? "Bold" : "Outline"}
          color="currentColor"
        />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
}
