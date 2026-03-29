"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft2, ArrowRight2, TickCircle } from "iconsax-reactjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

// ── Types ────────────────────────────────────────────────────────
type BillingCycle = "monthly" | "annual" | "weekly";

interface OnboardingData {
  currency: string;
  subscription: {
    name: string;
    amount: string;
    cycle: BillingCycle;
    category: string;
    nextPaymentDate: string;
  } | null;
}

// ── Constants ────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "NGN", symbol: "₦", label: "Nigerian Naira" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
];

const POPULAR_SERVICES = [
  { name: "Netflix", category: "Entertainment" },
  { name: "Spotify", category: "Music" },
  { name: "Apple Music", category: "Music" },
  { name: "YouTube", category: "Entertainment" },
  { name: "Disney+", category: "Entertainment" },
  { name: "Amazon Prime", category: "Entertainment" },
  { name: "Adobe CC", category: "Software & Apps" },
  { name: "Microsoft 365", category: "Software & Apps" },
  { name: "Notion", category: "Software & Apps" },
  { name: "Figma", category: "Software & Apps" },
  { name: "ChatGPT", category: "Software & Apps" },
  { name: "iCloud+", category: "Cloud Storage" },
];

const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Yearly" },
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

function iconColorFromName(name: string): string {
  const trimmed = name.trim();
  const hash = [...trimmed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return ICON_COLORS[hash % ICON_COLORS.length].rgba;
}

/** Default nextPaymentDate = today + one cycle */
function defaultNextPaymentDate(cycle: BillingCycle): string {
  const d = new Date();
  if (cycle === "weekly") d.setDate(d.getDate() + 7);
  else if (cycle === "annual") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

// ── Shared input style ────────────────────────────────────────────
const inputCls =
  "w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors";

// ── Step variants for animation ──────────────────────────────────
const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
};

// ═══════════════════════════════════════════════════════════════
// Step 1 — Currency
// ═══════════════════════════════════════════════════════════════
function StepCurrency({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  const selected =
    CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-foreground">
          Choose your currency
        </h2>
        <p className="text-sm text-muted">
          This will be used as your default across the dashboard.
        </p>
      </div>

      {/* Selected preview */}
      <div className="flex items-center gap-4 bg-surface border border-primary/30 rounded-2xl px-5 py-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "rgba(124,92,252,0.12)" }}
        >
          <span className="text-2xl font-black font-mono text-primary">
            {selected.symbol}
          </span>
        </div>
        <div>
          <p className="text-base font-black text-foreground">
            {selected.label}
          </p>
          <p className="text-xs text-muted font-semibold tracking-widest uppercase mt-0.5">
            {selected.code}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {CURRENCIES.map(({ code, symbol, label }) => {
          const isSelected = data.currency === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange({ currency: code })}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-4 rounded-2xl border transition-all",
                isSelected
                  ? "border-primary/60 bg-primary/10"
                  : "border-border bg-surface text-muted hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "text-xl font-black font-mono",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {symbol}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold tracking-widest uppercase",
                  isSelected ? "text-primary" : "text-muted"
                )}
              >
                {code}
              </span>
              <span
                className={cn(
                  "text-[9px] text-center leading-tight",
                  isSelected ? "text-primary/70" : "text-muted/60"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Step 2 — First subscription
// ═══════════════════════════════════════════════════════════════
function StepFirstSubscription({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}) {
  const sub = data.subscription ?? {
    name: "",
    amount: "",
    cycle: "monthly" as BillingCycle,
    category: DEFAULT_CATEGORIES[0].name,
    nextPaymentDate: "",
  };
  const currency =
    CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];

  function updateSub(patch: Partial<typeof sub>) {
    onChange({ subscription: { ...sub, ...patch } });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-foreground">
          Add your first subscription
        </h2>
        <p className="text-sm text-muted">
          Pick a service or type one in. You can add more later.
        </p>
      </div>

      {/* Popular service chips */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
          Popular services
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {POPULAR_SERVICES.map((service) => (
            <button
              key={service.name}
              type="button"
              onClick={() =>
                updateSub({ name: service.name, category: service.category })
              }
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                sub.name === service.name
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-surface text-muted hover:text-foreground hover:border-border/60"
              )}
            >
              {service.name}
            </button>
          ))}
        </div>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
            Service name
          </label>
          <input
            className={inputCls}
            type="text"
            placeholder="e.g. Netflix, Figma, iCloud+"
            value={sub.name}
            onChange={(e) => updateSub({ name: e.target.value })}
          />
        </div>

        {/* Amount + Cycle */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted font-mono pointer-events-none">
                {currency.symbol}
              </span>
              <input
                className={inputCls}
                style={{
                  paddingLeft: `${1 + currency.symbol.length * 0.6}rem`,
                }}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={sub.amount}
                onChange={(e) => updateSub({ amount: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
              Billed
            </label>
            <div className="flex gap-1.5">
              {BILLING_CYCLES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateSub({ cycle: value })}
                  className={cn(
                    "h-11.5 px-3 rounded-xl border text-xs font-semibold transition-all",
                    sub.cycle === value
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border bg-surface text-muted hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
            Category
          </label>
          <Select
            value={sub.category}
            onChange={(v) => updateSub({ category: v })}
            options={DEFAULT_CATEGORIES.map(({ name, color }) => ({
              value: name,
              label: name,
              dot: color,
            }))}
          />
        </div>

        {/* Next payment date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
            Next payment date{" "}
            <span className="normal-case tracking-normal font-normal text-muted/60">
              (optional)
            </span>
          </label>
          <DatePicker
            value={sub.nextPaymentDate}
            onChange={(v) => updateSub({ nextPaymentDate: v })}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Step 3 — All set
// ═══════════════════════════════════════════════════════════════
function StepAllSet({
  data,
  firstName,
}: {
  data: OnboardingData;
  firstName: string;
}) {
  const currency =
    CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
  const sub = data.subscription;

  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center"
      >
        <TickCircle size={40} color="var(--color-primary)" variant="Bold" />
      </motion.div>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-foreground">
          You&apos;re all set{firstName ? `, ${firstName}` : ""}!
        </h2>
        <p className="text-sm text-muted max-w-xs">
          Your account is ready. Head to your dashboard to start tracking.
        </p>
      </div>

      <div className="w-full bg-surface border border-border rounded-2xl p-5 text-left flex flex-col gap-3">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
          Your setup
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Currency</span>
            <span className="text-sm font-semibold text-foreground">
              {currency.symbol} {data.currency}
            </span>
          </div>

          {sub && sub.name ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">First subscription</span>
                <span className="text-sm font-semibold text-foreground">
                  {sub.name}
                  {sub.amount && (
                    <span className="text-muted font-normal">
                      {" "}
                      · {currency.symbol}
                      {sub.amount}/
                      {sub.cycle === "monthly"
                        ? "mo"
                        : sub.cycle === "annual"
                          ? "yr"
                          : "wk"}
                    </span>
                  )}
                </span>
              </div>
              {sub.category && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Category</span>
                  <span className="text-sm font-semibold text-foreground">
                    {sub.category}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">Subscriptions</span>
              <span className="text-sm text-muted italic">None added yet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Onboarding Content
// ═══════════════════════════════════════════════════════════════
const STEPS = ["Currency", "First sub", "All set"];

export function OnboardingContent() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const createUser = useMutation(api.users.createUser);
  const createSubscription = useMutation(api.subscriptions.createSubscription);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    currency: "USD",
    subscription: null,
  });

  const firstName = session?.user.name?.split(" ")[0] ?? "";

  function updateData(patch: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  async function goNext() {
    if (step === 1) {
      const sub = data.subscription;
      if (sub?.name.trim() && !sub.amount) {
        toast.error("Please enter an amount for your subscription.");
        return;
      }
    }

    if (step === STEPS.length - 1) {
      setIsSaving(true);
      try {
        await createUser({
          currency: data.currency,
          avatarUrl: session?.user.image ?? undefined,
        });

        const sub = data.subscription;
        if (sub && sub.name.trim() && sub.amount) {
          const nextPaymentDate =
            sub.nextPaymentDate || defaultNextPaymentDate(sub.cycle);
          await createSubscription({
            name: sub.name.trim(),
            amount: parseFloat(sub.amount),
            amountApprox: false,
            currency: data.currency,
            cycle: sub.cycle,
            nextPaymentDate,
            category: sub.category,
            paymentMode: "manual",
            status: "active",
            remindersEnabled: true,
            reminderIntervals: ["1d", "3d", "7d"],
            iconColor: iconColorFromName(sub.name),
          });
        }

        router.push("/dashboard");
      } finally {
        setIsSaving(false);
      }
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* ── Progress dots ─────────────────────────────────── */}
        <div className="flex items-center gap-2 justify-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i < step
                    ? "w-6 bg-primary/60"
                    : i === step
                      ? "w-8 bg-primary"
                      : "w-6 bg-border"
                )}
              />
            </div>
          ))}
        </div>

        {/* ── Animated step content ──────────────────────────── */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {step === 0 && <StepCurrency data={data} onChange={updateData} />}
              {step === 1 && (
                <StepFirstSubscription data={data} onChange={updateData} />
              )}
              {step === 2 && <StepAllSet data={data} firstName={firstName} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button
              variant="outlined"
              className="h-12 shrink-0"
              onClick={goBack}
              disabled={isSaving}
            >
              <ArrowLeft2 size={16} color="currentColor" />
            </Button>
          )}

          <Button
            variant="primary"
            className="flex-1 h-12 text-sm font-bold gap-2"
            onClick={goNext}
            isLoading={isSaving}
            disabled={isSaving}
          >
            {step === STEPS.length - 1 ? (
              "Go to dashboard"
            ) : step === 1 ? (
              <>
                {data.subscription?.name ? "Continue" : "Skip for now"}
                <ArrowRight2 size={16} color="currentColor" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight2 size={16} color="currentColor" />
              </>
            )}
          </Button>
        </div>

        {/* ── Step label ────────────────────────────────────── */}
        <p className="text-center text-[11px] text-muted">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
