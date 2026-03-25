"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Add, CloseCircle } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ── Constants ─────────────────────────────────────────────────────────────────

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

const CATEGORIES = [
  "Entertainment",
  "Productivity",
  "Utility",
  "Infrastructure",
  "Health & Fitness",
  "Finance",
  "Education",
  "Communication",
  "Design",
  "Developer Tools",
  "Other",
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
  { value: "1d", label: "1 DAY" },
  { value: "3d", label: "3 DAYS" },
  { value: "1w", label: "1 WEEK" },
];

// Deterministic icon color — derived from service name at save time (AI in prod)
const ICON_COLORS: { cls: string; rgba: string }[] = [
  { cls: "bg-primary/20", rgba: "rgba(124,92,252,0.20)" },
  { cls: "bg-secondary/20", rgba: "rgba(45,212,191,0.20)" },
  { cls: "bg-tertiary/20", rgba: "rgba(249,112,102,0.20)" },
  { cls: "bg-muted/20", rgba: "rgba(160,160,175,0.20)" },
  { cls: "bg-primary/40", rgba: "rgba(124,92,252,0.40)" },
  { cls: "bg-secondary/40", rgba: "rgba(45,212,191,0.40)" },
  { cls: "bg-tertiary/40", rgba: "rgba(249,112,102,0.40)" },
  { cls: "bg-[#1DB954]/20", rgba: "rgba(29,185,84,0.20)" },
  { cls: "bg-[#E50914]/20", rgba: "rgba(229,9,20,0.20)" },
  { cls: "bg-[#FF9900]/20", rgba: "rgba(255,153,0,0.20)" },
  { cls: "bg-[#0078D4]/20", rgba: "rgba(0,120,212,0.20)" },
  { cls: "bg-[#5E6AD2]/20", rgba: "rgba(94,106,210,0.20)" },
];

function iconFromName(name: string): {
  cls: string;
  rgba: string;
  initial: string;
} {
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

// ── Payment method types ──────────────────────────────────────────────────────

type PaymentMethodType =
  | "card"
  | "bank"
  | "paypal"
  | "apple_pay"
  | "google_pay"
  | "other";

type CardBrand = "apple" | "visa" | "mastercard" | "amex" | "other";

interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  /** Last 4 for card/bank, email for paypal, empty for digital wallets */
  detail: string;
  /** MM/YY expiry — cards only */
  expires?: string;
  isPrimary?: boolean;
  cardBrand?: CardBrand;
}

const PM_TYPE_OPTIONS: {
  value: PaymentMethodType;
  label: string;
  icon: string;
  rgba: string;
  labelPlaceholder: string;
  detailLabel: string;
  detailPlaceholder: string;
  hasDetail: boolean;
}[] = [
  {
    value: "card",
    label: "Card",
    icon: "CARD",
    rgba: "rgba(124,92,252,0.20)",
    labelPlaceholder: "e.g. Apple Card",
    detailLabel: "Last 4 digits",
    detailPlaceholder: "8821",
    hasDetail: true,
  },
  {
    value: "bank",
    label: "Bank Transfer",
    icon: "BANK",
    rgba: "rgba(0,120,212,0.20)",
    labelPlaceholder: "e.g. Chase Checking",
    detailLabel: "Account last 4",
    detailPlaceholder: "4532",
    hasDetail: true,
  },
  {
    value: "paypal",
    label: "PayPal",
    icon: "PP",
    rgba: "rgba(0,48,135,0.20)",
    labelPlaceholder: "PayPal",
    detailLabel: "Email or username",
    detailPlaceholder: "name@email.com",
    hasDetail: true,
  },
  {
    value: "apple_pay",
    label: "Apple Pay",
    icon: "AP",
    rgba: "rgba(255,255,255,0.10)",
    labelPlaceholder: "Apple Pay",
    detailLabel: "",
    detailPlaceholder: "",
    hasDetail: false,
  },
  {
    value: "google_pay",
    label: "Google Pay",
    icon: "GP",
    rgba: "rgba(66,133,244,0.20)",
    labelPlaceholder: "Google Pay",
    detailLabel: "",
    detailPlaceholder: "",
    hasDetail: false,
  },
  {
    value: "other",
    label: "Other",
    icon: "●",
    rgba: "rgba(160,160,175,0.20)",
    labelPlaceholder: "Payment method name",
    detailLabel: "Detail (optional)",
    detailPlaceholder: "Any additional info",
    hasDetail: true,
  },
];

// ── Mock saved data ───────────────────────────────────────────────────────────

interface SavedAccount {
  id: string;
  email: string;
  label: string;
  isPrimary?: boolean;
}

// Mirrors the cards saved in Settings → Payment Methods
const MOCK_PAYMENT_METHODS: SavedPaymentMethod[] = [
  {
    id: "pm_1",
    type: "card",
    label: "Apple Card",
    detail: "8821",
    expires: "09/27",
    isPrimary: true,
    cardBrand: "apple",
  },
  {
    id: "pm_2",
    type: "card",
    label: "Chase Sapphire",
    detail: "4242",
    expires: "04/26",
    isPrimary: false,
    cardBrand: "visa",
  },
  {
    id: "pm_3",
    type: "card",
    label: "Mastercard",
    detail: "9012",
    expires: "11/25",
    isPrimary: false,
    cardBrand: "mastercard",
  },
];

const MOCK_LINKED_ACCOUNTS: SavedAccount[] = [
  {
    id: "acc_primary",
    email: "m.jackson@gmail.com",
    label: "Primary",
    isPrimary: true,
  },
  { id: "acc_2", email: "work@company.com", label: "Work Email" },
];

// ── Form types ────────────────────────────────────────────────────────────────

export interface SubscriptionFormData {
  name: string;
  plan: string;
  amount: string;
  amountApprox: boolean;
  cycle: BillingCycle;
  customInterval: string;
  nextPaymentDate: string;
  category: string;
  paymentMethodId: string;
  paymentMode: "auto" | "manual";
  linkedAccountId: string;
  remindersEnabled: boolean;
  reminderIntervals: string[];
  status: SubscriptionStatus;
  notes: string;
}

const DEFAULT_FORM: SubscriptionFormData = {
  name: "",
  plan: "",
  amount: "",
  amountApprox: false,
  cycle: "monthly",
  customInterval: "3_Months",
  nextPaymentDate: "",
  category: "Entertainment",
  paymentMethodId: "",
  paymentMode: "manual",
  linkedAccountId: "acc_primary", // default to primary account
  remindersEnabled: true,
  reminderIntervals: ["3d"],
  status: "active",
  notes: "",
};

// ── Sub-components ────────────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

export interface SubscriptionFormModalProps {
  open: boolean;
  onClose: () => void;
  initial?: Partial<SubscriptionFormData>;
  onSave: (data: SubscriptionFormData) => void;
}

export function SubscriptionFormModal({
  open,
  onClose,
  initial,
  onSave,
}: SubscriptionFormModalProps) {
  const [form, setForm] = useState<SubscriptionFormData>({
    ...DEFAULT_FORM,
    ...initial,
  });

  // ── Payment method UI state ───────────────────────────────────────────────
  const [localPms, setLocalPms] = useState<SavedPaymentMethod[]>([]);
  const [addingPm, setAddingPm] = useState(false);
  const [newPmType, setNewPmType] = useState<PaymentMethodType>("card");
  const [newPmLabel, setNewPmLabel] = useState("");
  const [newPmDetail, setNewPmDetail] = useState("");
  const [newPmCardBrand, setNewPmCardBrand] = useState<CardBrand>("other");
  const [newPmExpires, setNewPmExpires] = useState("");

  // ── Linked account UI state ───────────────────────────────────────────────
  const [localAccounts, setLocalAccounts] = useState<SavedAccount[]>([]);
  const [addingAcc, setAddingAcc] = useState(false);
  const [newAccEmail, setNewAccEmail] = useState("");
  const [newAccLabel, setNewAccLabel] = useState("");

  const isEdit = Boolean(initial?.name);
  const allPms = [...MOCK_PAYMENT_METHODS, ...localPms];
  const allAccounts = [...MOCK_LINKED_ACCOUNTS, ...localAccounts];
  const selectedPmMeta = PM_TYPE_OPTIONS.find((t) => t.value === newPmType)!;

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

  function confirmAddPm() {
    if (!newPmLabel.trim()) return;
    const pm: SavedPaymentMethod = {
      id: `pm_local_${Date.now()}`,
      type: newPmType,
      label: newPmLabel.trim(),
      detail: newPmDetail.trim(),
      ...(newPmType === "card" && {
        cardBrand: newPmCardBrand,
        ...(newPmExpires.trim() && { expires: newPmExpires.trim() }),
      }),
    };
    setLocalPms((prev) => [...prev, pm]);
    set("paymentMethodId", pm.id);
    setAddingPm(false);
    setNewPmLabel("");
    setNewPmDetail("");
    setNewPmType("card");
    setNewPmCardBrand("other");
    setNewPmExpires("");
  }

  function confirmAddAccount() {
    if (!newAccEmail.trim()) return;
    const acc: SavedAccount = {
      id: `acc_local_${Date.now()}`,
      email: newAccEmail.trim(),
      label: newAccLabel.trim() || "Account",
    };
    setLocalAccounts((prev) => [...prev, acc]);
    set("linkedAccountId", acc.id);
    setAddingAcc(false);
    setNewAccEmail("");
    setNewAccLabel("");
  }

  function handleSave() {
    onSave(form);
    onClose();
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
                    ? "Refine your vault asset details."
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
              {/* ── SERVICE IDENTITY ───────────────────────────────── */}
              <section className="flex flex-col gap-4">
                <SectionLabel>Service Identity</SectionLabel>

                {/* Live icon preview */}
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
                      Icon and color auto-generated from name
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
                  <FieldLabel>Plan Name (optional)</FieldLabel>
                  <input
                    className={inputCls}
                    placeholder="e.g. Premium Family Plan"
                    value={form.plan}
                    onChange={(e) => set("plan", e.target.value)}
                  />
                </div>
              </section>

              {/* ── PRICING ────────────────────────────────────────── */}
              <section className="flex flex-col gap-4">
                <SectionLabel>Pricing</SectionLabel>

                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Amount</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted pointer-events-none">
                      {form.amountApprox ? "~$" : "$"}
                    </span>
                    <input
                      className={cn(inputCls, "pl-9")}
                      type="text"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => set("amount", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-3 bg-background rounded-xl border border-border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Usage-based amount
                    </p>
                    <p className="text-[11px] text-muted mt-0.5">
                      Displays with ~ prefix to indicate approximate cost
                    </p>
                  </div>
                  <Toggle
                    enabled={form.amountApprox}
                    onChange={(v) => set("amountApprox", v)}
                  />
                </div>
              </section>

              {/* ── BILLING CYCLE ──────────────────────────────────── */}
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

                {/* Custom interval — shown when "Custom" is selected */}
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

              {/* ── SCHEDULE ───────────────────────────────────────── */}
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

              {/* ── CATEGORY ───────────────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <SectionLabel>Category</SectionLabel>
                <div className="relative">
                  <select
                    className={cn(
                      inputCls,
                      "appearance-none cursor-pointer pr-8"
                    )}
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">
                    ▾
                  </span>
                </div>
              </section>

              {/* ── PAYMENT METHOD ─────────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <SectionLabel>Payment Method</SectionLabel>

                <div className="flex flex-col gap-2">
                  {allPms.map((pm) => (
                    <PaymentMethodRow
                      key={pm.id}
                      pm={pm}
                      selected={form.paymentMethodId === pm.id}
                      onSelect={() => set("paymentMethodId", pm.id)}
                    />
                  ))}

                  <AnimatePresence mode="wait">
                    {addingPm && (
                      <motion.div
                        key="new-pm-form"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex flex-col gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5"
                      >
                        {/* Type selector */}
                        <div className="flex flex-col gap-1.5">
                          <FieldLabel>Type</FieldLabel>
                          <div className="grid grid-cols-3 gap-1.5">
                            {PM_TYPE_OPTIONS.map((t) => (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => {
                                  setNewPmType(t.value);
                                  setNewPmLabel(
                                    ["apple_pay", "google_pay"].includes(
                                      t.value
                                    )
                                      ? t.labelPlaceholder
                                      : ""
                                  );
                                  setNewPmDetail("");
                                }}
                                className={cn(
                                  "py-2 rounded-lg text-[10px] font-bold transition-colors",
                                  newPmType === t.value
                                    ? "bg-primary text-white"
                                    : "bg-background border border-border text-muted hover:text-foreground"
                                )}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Label */}
                        <input
                          className={inputCls}
                          placeholder={selectedPmMeta.labelPlaceholder}
                          value={newPmLabel}
                          onChange={(e) => setNewPmLabel(e.target.value)}
                        />

                        {/* Detail — only for relevant types */}
                        {selectedPmMeta.hasDetail && (
                          <input
                            className={inputCls}
                            placeholder={selectedPmMeta.detailPlaceholder}
                            value={newPmDetail}
                            onChange={(e) => setNewPmDetail(e.target.value)}
                          />
                        )}

                        {/* Card brand + expires — cards only */}
                        {newPmType === "card" && (
                          <>
                            <div className="flex flex-col gap-1.5">
                              <FieldLabel>Card Brand</FieldLabel>
                              <div className="flex gap-1.5 flex-wrap">
                                {(
                                  [
                                    "apple",
                                    "visa",
                                    "mastercard",
                                    "amex",
                                    "other",
                                  ] as CardBrand[]
                                ).map((brand) => (
                                  <button
                                    key={brand}
                                    type="button"
                                    onClick={() => setNewPmCardBrand(brand)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors",
                                      newPmCardBrand === brand
                                        ? "bg-primary text-white"
                                        : "bg-background border border-border text-muted hover:text-foreground"
                                    )}
                                  >
                                    {brand === "apple"
                                      ? "Apple"
                                      : brand === "visa"
                                        ? "VISA"
                                        : brand === "mastercard"
                                          ? "MC"
                                          : brand === "amex"
                                            ? "AMEX"
                                            : "Other"}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <input
                              className={inputCls}
                              placeholder="Expires MM/YY"
                              value={newPmExpires}
                              onChange={(e) => setNewPmExpires(e.target.value)}
                              maxLength={5}
                            />
                          </>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={confirmAddPm}
                            disabled={!newPmLabel.trim()}
                          >
                            Add Method
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setAddingPm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Payment mode */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <FieldLabel>Payment Mode</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {(["auto", "manual"] as const).map((mode) => (
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
                </div>
              </section>

              {/* ── LINKED ACCOUNT ─────────────────────────────────── */}
              <section className="flex flex-col gap-3">
                <div>
                  <SectionLabel>Linked Account</SectionLabel>
                  <p className="text-[11px] text-muted mt-1">
                    Defaults to your primary account if not changed.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {allAccounts.map((acc) => (
                    <LinkedAccountRow
                      key={acc.id}
                      acc={acc}
                      selected={form.linkedAccountId === acc.id}
                      onSelect={() => set("linkedAccountId", acc.id)}
                    />
                  ))}

                  <AnimatePresence mode="wait">
                    {addingAcc ? (
                      <motion.div
                        key="new-acc-form"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex flex-col gap-2 p-4 rounded-xl border border-primary/30 bg-primary/5"
                      >
                        <input
                          className={inputCls}
                          type="email"
                          placeholder="Email or account ID"
                          value={newAccEmail}
                          onChange={(e) => setNewAccEmail(e.target.value)}
                        />
                        <input
                          className={inputCls}
                          placeholder="Label (e.g. Primary, Work)"
                          value={newAccLabel}
                          onChange={(e) => setNewAccLabel(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={confirmAddAccount}
                            disabled={!newAccEmail.trim()}
                          >
                            Add Account
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setAddingAcc(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add-acc-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Button
                          variant="outlined"
                          className="w-full rounded-xl border-dashed border-border text-muted hover:text-foreground hover:border-primary/40 justify-start"
                          icon={<Add size={15} color="currentColor" />}
                          onClick={() => setAddingAcc(true)}
                        >
                          Add another account
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* ── REMINDERS ──────────────────────────────────────── */}
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

              {/* ── OPERATIONAL STATUS ─────────────────────────────── */}
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

              {/* ── NOTES ──────────────────────────────────────────── */}
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
              >
                Save Subscription
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

// ── Row sub-components ────────────────────────────────────────────────────────

const CARD_BRAND_CONFIG: Record<
  CardBrand,
  { text: string; bg: string; color: string }
> = {
  apple: { text: "A", bg: "rgba(255,255,255,0.10)", color: "#ffffff" },
  visa: { text: "VISA", bg: "rgba(26,31,113,0.25)", color: "#4B6CF5" },
  mastercard: { text: "MC", bg: "rgba(235,0,27,0.12)", color: "#EB001B" },
  amex: { text: "AMEX", bg: "rgba(0,123,193,0.18)", color: "#007BC1" },
  other: { text: "●", bg: "rgba(160,160,175,0.20)", color: "#a0a0af" },
};

function CardBrandBadge({ brand }: { brand: CardBrand }) {
  const { text, bg, color } = CARD_BRAND_CONFIG[brand];
  return (
    <div
      className="w-10 h-7 rounded-lg flex items-center justify-center font-black text-[9px] tracking-wider shrink-0"
      style={{ backgroundColor: bg, color }}
    >
      {text}
    </div>
  );
}

function PaymentMethodRow({
  pm,
  selected,
  onSelect,
}: {
  pm: SavedPaymentMethod;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = PM_TYPE_OPTIONS.find((t) => t.value === pm.type)!;
  const detailText = pm.detail
    ? ["card", "bank"].includes(pm.type)
      ? `•••• ${pm.detail}`
      : pm.detail
    : "";
  const expiresText = pm.expires ? `Exp ${pm.expires}` : "";
  const subtitle = [detailText, expiresText].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left w-full",
        selected
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-background hover:border-primary/20"
      )}
    >
      {pm.type === "card" && pm.cardBrand ? (
        <CardBrandBadge brand={pm.cardBrand} />
      ) : (
        <div
          className="w-10 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-foreground shrink-0"
          style={{ backgroundColor: meta.rgba }}
        >
          {meta.icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 leading-none">
          <p className="text-sm font-semibold text-foreground">{pm.label}</p>
          {pm.isPrimary && (
            <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[9px] font-bold tracking-widest uppercase">
              Primary
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
      {selected && (
        <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-[9px] font-black">✓</span>
        </span>
      )}
    </button>
  );
}

function LinkedAccountRow({
  acc,
  selected,
  onSelect,
}: {
  acc: SavedAccount;
  selected: boolean;
  onSelect: () => void;
}) {
  const initial = acc.email[0].toUpperCase();
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left w-full",
        selected
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-background hover:border-primary/20"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-none truncate">
          {acc.email}
        </p>
        <p className="text-xs text-muted mt-0.5">
          {acc.label}
          {acc.isPrimary && " · Primary"}
        </p>
      </div>
      {selected && (
        <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-[9px] font-black">✓</span>
        </span>
      )}
    </button>
  );
}
