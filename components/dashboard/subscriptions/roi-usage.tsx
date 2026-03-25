"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Frequency = "Rarely" | "Weekly" | "Daily";

export function RoiUsage() {
  const [frequency, setFrequency] = useState<Frequency>("Weekly");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-foreground">ROI &amp; Usage</h2>

      <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-5">
        {/* Frequency */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
            How often do I use this?
          </span>
          <div className="flex items-center gap-2">
            {(["Rarely", "Weekly", "Daily"] as Frequency[]).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200",
                  frequency === f
                    ? "border border-primary text-primary bg-primary/5"
                    : "border border-border text-muted hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Usage notes */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
            Usage Notes
          </span>
          <textarea
            placeholder="Write a private note about this service..."
            rows={4}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted resize-none outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Insight */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-primary leading-relaxed">
            <span className="font-bold">Subsense Insight:</span> This
            subscription is used 85% more than other entertainment services in
            your profile. You&apos;re getting great value.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
