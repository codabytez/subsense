"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type Frequency = "rarely" | "weekly" | "daily";

const FREQ_LABELS: Record<Frequency, string> = {
  rarely: "Rarely",
  weekly: "Weekly",
  daily: "Daily",
};

const INSIGHTS: Record<Frequency, string> = {
  rarely:
    "You rarely use this service. Consider whether it's worth keeping — cancelling could free up budget.",
  weekly:
    "You use this service regularly. It's contributing decent value relative to its cost.",
  daily:
    "You use this service daily. You're getting great value — this is one of your most-used subscriptions.",
};

interface Props {
  subscriptionId: Id<"subscriptions">;
}

export function RoiUsage({ subscriptionId }: Props) {
  const sub = useQuery(api.subscriptions.getSubscriptionById, {
    id: subscriptionId,
  });
  const updateUsage = useMutation(api.paymentLogs.updateUsage);

  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Sync from DB on first load
  useEffect(() => {
    if (sub) {
      setFrequency((sub.usageFrequency as Frequency | undefined) ?? "weekly");
      setNotes(sub.usageNotes ?? "");
      setDirty(false);
    }
  }, [sub?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    setSaving(true);
    try {
      await updateUsage({
        id: subscriptionId,
        usageFrequency: frequency,
        usageNotes: notes.trim() || undefined,
      });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

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
            {(["rarely", "weekly", "daily"] as Frequency[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFrequency(f);
                  setDirty(true);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200",
                  frequency === f
                    ? "border border-primary text-primary bg-primary/5"
                    : "border border-border text-muted hover:text-foreground"
                )}
              >
                {FREQ_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
            Usage Notes
          </span>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setDirty(true);
            }}
            placeholder="Write a private note about this service..."
            rows={3}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/40 resize-none outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Save button — only shows when dirty */}
        {dirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="self-end px-5 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        )}

        {/* Insight */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-primary leading-relaxed">
            <span className="font-bold">Subsense Insight: </span>
            {INSIGHTS[frequency]}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
