"use client";

import { cn } from "@/lib/utils";

export function CardChip({
  brand,
  last4,
  status,
  expires,
  logo,
}: {
  brand: string;
  last4: string;
  status: "PRIMARY" | "ACTIVE";
  expires: string;
  logo: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-0 bg-neutral rounded-2xl p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center shrink-0 overflow-hidden">
            {logo}
          </div>
          <div>
            <p className="text-base font-bold text-foreground">{brand}</p>
            <p className="text-sm text-muted mt-0.5">•••• {last4}</p>
          </div>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded",
            status === "PRIMARY"
              ? "bg-primary text-white"
              : "bg-secondary/15 text-secondary"
          )}
        >
          {status}
        </span>
      </div>
      <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
        EXPIRES {expires}
      </p>
    </div>
  );
}
