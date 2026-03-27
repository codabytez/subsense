"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloseCircle, Setting2 } from "iconsax-reactjs";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectOption } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";

// ── Types ─────────────────────────────────────────────────────
type BillingCycle =
  | "weekly"
  | "monthly"
  | "annual"
  | "trial"
  | "usage-based"
  | "custom";

type SubscriptionStatus = "active" | "trial" | "paused" | "cancelled";

// ── Constants ─────────────────────────────────────────────────
const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Yearly" },
  { value: "trial", label: "Trial" },
  { value: "usage-based", label: "Usage" },
  { value: "custom", label: "Custom" },
];

const CUSTOM_INTERVALS = [
  { value: "2_Weeks", label: "Every 2 weeks" },
  { value: "6_Weeks", label: "Every 6 weeks" },
  { value: "2_Months", label: "Every 2 months" },
  { value: "3_Months", label: "Every 3 months" },
  { value: "6_Months", label: "Every 6 months" },
  { value: "18_Months", label: "Every 18 months" },
  { value: "2_Years", label: "Every 2 years" },
];

const STATUS_OPTIONS: {
  value: SubscriptionStatus;
  label: string;
  activeClass: string;
}[] = [
  {
    value: "active",
    label: "Active",
    activeClass: "bg-secondary/20 text-secondary border border-secondary/30",
  },
  {
    value: "trial",
    label: "Trial",
    activeClass: "bg-primary/20 text-primary border border-primary/30",
  },
  {
    value: "paused",
    label: "Paused",
    activeClass: "bg-muted/20 text-foreground border border-muted/20",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    activeClass: "bg-tertiary/20 text-tertiary border border-tertiary/30",
  },
];

const REMINDER_INTERVALS = [
  { value: "1d", label: "1 Day" },
  { value: "3d", label: "3 Days" },
  { value: "1w", label: "1 Week" },
];

const ICON_COLORS: { rgba: string }[] = [
  { rgba: "rgba(124,92,252,0.20)" },
  { rgba: "rgba(45,212,191,0.20)" },
  { rgba: "rgba(249,112,102,0.20)" },
  { rgba: "rgba(160,160,175,0.20)" },
  { rgba: "rgba(124,92,252,0.40)" },
  { rgba: "rgba(45,212,191,0.40)" },
  { rgba: "rgba(29,185,84,0.20)" },
  { rgba: "rgba(229,9,20,0.20)" },
  { rgba: "rgba(255,153,0,0.20)" },
  { rgba: "rgba(0,120,212,0.20)" },
  { rgba: "rgba(94,106,210,0.20)" },
  { rgba: "rgba(249,112,102,0.40)" },
];

function iconFromName(name: string): { rgba: string; initial: string } {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const initial = !words.length
    ? "?"
    : words.length === 1
      ? words[0].slice(0, 2).toUpperCase()
      : (words[0][0] + words[words.length - 1][0]).toUpperCase();
  const hash = [...trimmed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return { ...ICON_COLORS[hash % ICON_COLORS.length], initial };
}

const DEFAULT_FORM: SubscriptionFormData = {
  name: "",
  plan: "",
  amount: "",
  amountApprox: false,
  cycle: "monthly",
  customInterval: "3_Months",
  nextPaymentDate: "",
  category: DEFAULT_CATEGORIES[0].name,
  paymentMethodId: "none",
  paymentMode: "manual",
  remindersEnabled: true,
  reminderIntervals: ["3d"],
  status: "active",
  notes: "",
};

// ── Sub-components ────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
      {children}
    </label>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0",
        enabled ? "bg-primary" : "bg-border"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
          enabled ? "left-5.5" : "left-0.5"
        )}
      />
    </button>
  );
}

const inputCls =
  "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors";

// ── Props ─────────────────────────────────────────────────────
export interface SubscriptionFormModalProps {
  open: boolean;
  onClose: () => void;
  editId?: Id<"subscriptions">;
}

export function SubscriptionFormModal({
  open,
  onClose,
  editId,
}: SubscriptionFormModalProps) {
  const user = useQuery(api.users.getCurrentUser);
  const customCategories = useQuery(api.categories.getCategories);
  const paymentMethods = useQuery(api.paymentMethods.getPaymentMethods);

  const createSubscription = useMutation(api.subscriptions.createSubscription);
  const updateSubscription = useMutation(api.subscriptions.updateSubscription);

  const isEdit = Boolean(editId);
  const [form, setForm] = useState<SubscriptionFormData>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const pmInitialized = useRef(false);

  // Set currency symbol from user preference
  const currencyCode = user?.currency ?? "USD";

  // Merge default + custom categories
  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...(customCategories ?? []).map((c) => ({ name: c.name, color: c.color })),
  ];

  const categoryOptions: SelectOption[] = allCategories.map((c) => ({
    value: c.name,
    label: c.name,
    dot: c.color,
  }));

  // Pre-select default payment method once when list first loads
  useEffect(() => {
    if (paymentMethods && !pmInitialized.current) {
      pmInitialized.current = true;
      const def = paymentMethods.find((m) => m.isDefault);
      if (def) setForm((f) => ({ ...f, paymentMethodId: def._id }));
    }
  }, [paymentMethods]);

  function set<K extends keyof SubscriptionFormData>(
    key: K,
    value: SubscriptionFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleReminderInterval(v: string) {
    setForm((prev) => ({
      ...prev,
      reminderIntervals: prev.reminderIntervals.includes(v)
        ? prev.reminderIntervals.filter((i) => i !== v)
        : [...prev.reminderIntervals, v],
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.amount || !form.nextPaymentDate) {
      toast.error("Name, amount, and next payment date are required.");
      return;
    }

    const icon = iconFromName(form.name);

    const payload = {
      name: form.name.trim(),
      plan: form.plan.trim() || undefined,
      amount: parseFloat(form.amount),
      amountApprox: form.amountApprox,
      currency: user?.currency ?? "USD ($) — United States Dollar",
      cycle: form.cycle,
      customInterval: form.cycle === "custom" ? form.customInterval : undefined,
      nextPaymentDate: form.nextPaymentDate,
      category: form.category,
      paymentMethodId:
        form.paymentMethodId !== "none"
          ? (form.paymentMethodId as Id<"paymentMethods">)
          : undefined,
      paymentMode: form.paymentMode,
      remindersEnabled: form.remindersEnabled,
      reminderIntervals: form.remindersEnabled ? form.reminderIntervals : [],
      status: form.status,
      notes: form.notes.trim() || undefined,
      iconColor: icon.rgba,
    };

    setIsSaving(true);
    try {
      if (isEdit && editId) {
        await updateSubscription({ id: editId, ...payload });
        toast.success("Subscription updated");
      } else {
        await createSubscription(payload);
        toast.success("Subscription added");
      }
      onClose();
      setForm(DEFAULT_FORM);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const icon = iconFromName(form.name);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide-in panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-120 bg-surface border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-border shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {isEdit ? "Edit Subscription" : "Add Subscription"}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {isEdit
                    ? "Update your subscription details."
                    : "Track a new service in your vault."}
                </p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="border-0 text-muted hover:text-foreground"
                onClick={onClose}
                icon={<CloseCircle size={20} color="currentColor" />}
              />
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-7">
              {/* ── SERVICE IDENTITY ─────────────────────────── */}
              <section className="flex flex-col gap-4">
                <SectionLabel>Service Identity</SectionLabel>

                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-foreground shrink-0"
                    style={{ backgroundColor: icon.rgba }}
                  >
                    {icon.initial}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      {form.name || "Service Name"}
                    </p>
                    <p className="text-[11px] text-muted">
                      Icon auto-generated from name
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Service Name</FieldLabel>
                  <input
                    className={inputCls}
                    placeholder="e.g. Netflix"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Plan Type (optional)</FieldLabel>
                  <input
                    className={inputCls}
                    placeholder="e.g. Premium, Pro, Basic"
                    value={form.plan}
                    onChange={(e) => set("plan", e.target.value)}
                  />
                </div>
              </section>

              {/* ── PRICING ──────────────────────────────────── */}
              <section className="flex flex-col gap-4">
                <SectionLabel>Pricing</SectionLabel>

                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Amount</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted pointer-events-none">
                      {form.amountApprox ? `~${currencyCode}` : currencyCode}
                    </span>
                    <input
                      className={cn(inputCls, "pl-12")}
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => set("amount", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-background rounded-xl border border-border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Usage-based / approximate
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                      Shows ~ prefix to indicate variable cost
                    </p>
                  </div>
                  <Toggle
                    enabled={form.amountApprox}
                    onChange={(v) => set("amountApprox", v)}
                  />
                </div>
              </section>

              {/* ── BILLING CYCLE ────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <SectionLabel>Billing Cycle</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {BILLING_CYCLES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("cycle", value)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-bold transition-colors",
                        form.cycle === value
                          ? "bg-primary text-white"
                          : "bg-background border border-border text-muted hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {form.cycle === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="relative pt-1">
                        <select
                          className={cn(
                            inputCls,
                            "appearance-none cursor-pointer pr-8"
                          )}
                          value={form.customInterval}
                          onChange={(e) =>
                            set("customInterval", e.target.value)
                          }
                        >
                          {CUSTOM_INTERVALS.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                          ▾
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* ── SCHEDULE ─────────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <SectionLabel>Schedule</SectionLabel>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Next Payment Date</FieldLabel>
                  <input
                    className={inputCls}
                    type="date"
                    value={form.nextPaymentDate}
                    onChange={(e) => set("nextPaymentDate", e.target.value)}
                  />
                </div>
              </section>

              {/* ── CATEGORY ─────────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <SectionLabel>Category</SectionLabel>
                <Select
                  value={form.category}
                  options={categoryOptions}
                  onChange={(v) => set("category", v)}
                />
              </section>

              {/* ── PAYMENT METHOD ───────────────────────────── */}
              <section className="flex flex-col gap-3">
                <SectionLabel>Payment Method</SectionLabel>

                {paymentMethods === undefined ? (
                  <div className="h-10 rounded-xl bg-background animate-pulse" />
                ) : paymentMethods.length === 0 ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-background border border-border">
                    <p className="text-sm text-muted">
                      No payment methods saved
                    </p>
                    <a
                      href="/dashboard/settings"
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                    >
                      <Setting2 size={12} color="currentColor" />
                      Manage
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* None / Manual option */}
                    <button
                      type="button"
                      onClick={() => set("paymentMethodId", "none")}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors text-left",
                        form.paymentMethodId === "none"
                          ? "border-primary/60 bg-primary/10 text-foreground"
                          : "border-border text-muted hover:text-foreground"
                      )}
                    >
                      <span className="w-7 h-7 rounded-lg bg-border/50 flex items-center justify-center text-[10px] font-black text-muted shrink-0">
                        —
                      </span>
                      Manual / Not specified
                    </button>

                    {paymentMethods.map((pm) => {
                      const display =
                        pm.type === "card" && pm.brand
                          ? pm.last4
                            ? `${pm.brand} ···${pm.last4}`
                            : pm.brand
                          : pm.label;
                      return (
                        <button
                          key={pm._id}
                          type="button"
                          onClick={() => set("paymentMethodId", pm._id)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors text-left",
                            form.paymentMethodId === pm._id
                              ? "border-primary/60 bg-primary/10 text-foreground"
                              : "border-border text-muted hover:text-foreground"
                          )}
                        >
                          <span className="w-7 h-7 rounded-lg bg-border/50 flex items-center justify-center text-[10px] font-black text-foreground shrink-0 uppercase">
                            {pm.type === "card" && pm.brand
                              ? pm.brand.slice(0, 2)
                              : pm.type.slice(0, 2)}
                          </span>
                          <span className="flex-1 truncate">{display}</span>
                          {pm.isDefault && (
                            <span className="text-[9px] font-bold tracking-widest uppercase text-primary shrink-0">
                              Default
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Payment mode */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <FieldLabel>Payment Mode</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {(["manual", "auto"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => set("paymentMode", mode)}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-bold transition-colors",
                          form.paymentMode === mode
                            ? "bg-primary text-white"
                            : "bg-background border border-border text-muted hover:text-foreground"
                        )}
                      >
                        {mode === "auto" ? "Auto-Pay" : "Manual"}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted">
                    {form.paymentMode === "auto"
                      ? "Renewal date auto-advances when payment is due."
                      : "You confirm each payment manually when it's due."}
                  </p>
                </div>
              </section>

              {/* ── REMINDERS ────────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <SectionLabel>Enable Reminders</SectionLabel>
                  <Toggle
                    enabled={form.remindersEnabled}
                    onChange={(v) => set("remindersEnabled", v)}
                  />
                </div>

                <AnimatePresence>
                  {form.remindersEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 overflow-hidden"
                    >
                      {REMINDER_INTERVALS.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleReminderInterval(value)}
                          className={cn(
                            "flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors",
                            form.reminderIntervals.includes(value)
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-background border border-border text-muted hover:text-foreground"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* ── STATUS ───────────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <SectionLabel>Operational Status</SectionLabel>
                <div className="grid grid-cols-4 gap-2">
                  {STATUS_OPTIONS.map(({ value, label, activeClass }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("status", value)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-bold transition-colors",
                        form.status === value
                          ? activeClass
                          : "bg-background border border-border text-muted hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              {/* ── NOTES ────────────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <SectionLabel>Notes</SectionLabel>
                <textarea
                  className={cn(inputCls, "resize-none min-h-24")}
                  placeholder="Anything worth remembering about this subscription…"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-5 border-t border-border shrink-0">
              <Button
                className="flex-1 rounded-xl h-12 text-sm"
                size="lg"
                onClick={handleSave}
                isLoading={isSaving}
                disabled={isSaving}
              >
                {isEdit ? "Update Subscription" : "Save Subscription"}
              </Button>
              <Button
                variant="secondary"
                className="rounded-xl"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
