"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, TickCircle, CloseCircle } from "iconsax-reactjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface LinkedAccountProps {
  subscriptionId: Id<"subscriptions">;
  defaultEmail: string;
  currentLinkedEmail?: string;
  currentLinkedLabel?: string;
}

export function LinkedAccount({
  subscriptionId,
  defaultEmail,
  currentLinkedEmail,
  currentLinkedLabel,
}: LinkedAccountProps) {
  const updateLinkedAccount = useMutation(api.paymentLogs.updateLinkedAccount);

  const displayEmail = currentLinkedEmail ?? defaultEmail;
  const displayLabel = currentLinkedLabel ?? "Primary Billing Email";
  const initial = displayEmail[0]?.toUpperCase() ?? "?";

  const [editing, setEditing] = useState(false);
  const [emailInput, setEmailInput] = useState(displayEmail);
  const [labelInput, setLabelInput] = useState(displayLabel);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!emailInput.trim()) return;
    setSaving(true);
    try {
      await updateLinkedAccount({
        id: subscriptionId,
        linkedEmail: emailInput.trim(),
        linkedLabel: labelInput.trim() || undefined,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEmailInput(displayEmail);
    setLabelInput(displayLabel);
    setEditing(false);
  }

  const inputCls =
    "w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Linked Account</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-muted hover:text-foreground transition-colors"
          >
            <Edit2 size={16} color="currentColor" />
          </button>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        {editing ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-muted">
                Email / Username
              </label>
              <input
                className={inputCls}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="account@email.com"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-muted">
                Label (optional)
              </label>
              <input
                className={inputCls}
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="e.g. Primary Billing Email"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !emailInput.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <TickCircle size={14} color="currentColor" />
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-muted border border-border hover:text-foreground transition-colors"
              >
                <CloseCircle size={14} color="currentColor" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {displayEmail}
              </p>
              <p className="text-xs text-muted mt-0.5">{displayLabel}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
