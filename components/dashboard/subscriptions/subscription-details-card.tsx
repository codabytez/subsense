"use client";

import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  Repeat,
  Card,
  Bank,
  Paypal,
  Wallet,
  Flash,
  Notification,
  NotificationBing,
  Note,
  People,
  Moneys,
} from "iconsax-reactjs";

import { PaymentMethodLogo } from "@/components/ui/payment-method-logo";
import { formatAmount } from "@/lib/currency";

function formatInterval(interval: string): string {
  const m = interval.match(/^(\d+)(d|w)$/);
  if (!m) return interval;
  const n = parseInt(m[1]);
  const unit =
    m[2] === "w" ? (n === 1 ? "week" : "weeks") : n === 1 ? "day" : "days";
  return `${n} ${unit}`;
}

const CYCLE_LABELS: Record<string, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  annual: "Annual",
  trial: "Trial",
  "usage-based": "Usage-based",
  "one-off": "One-off",
  custom: "Custom",
};

const METHOD_ICONS: Record<string, React.ElementType> = {
  card: Card,
  bank: Bank,
  paypal: Paypal,
  apple_pay: Wallet,
  google_pay: Wallet,
  other: Wallet,
};

const CARD_BG: Record<string, string> = {
  Visa: "linear-gradient(135deg, #1A1F71 0%, #3451B2 100%)",
  Mastercard: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  Amex: "linear-gradient(135deg, #007BC1 0%, #0056A0 100%)",
  Discover: "linear-gradient(135deg, #FF6600 0%, #cc5200 100%)",
  Verve: "linear-gradient(135deg, #00A86B 0%, #007a4d 100%)",
};

const TYPE_BG: Record<string, string> = {
  paypal: "linear-gradient(135deg, #003087 0%, #001f5e 100%)",
  apple_pay: "linear-gradient(135deg, #1C1C1E 0%, #000 100%)",
  google_pay: "linear-gradient(135deg, #4285F4 0%, #1a56cc 100%)",
  bank: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
  other: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
};

const FALLBACK_BG = "linear-gradient(135deg, #374151 0%, #1f2937 100%)";

type PayMethod = {
  type: string;
  label: string;
  brand?: string;
  last4?: string;
  expiry?: string;
};

function PayWithCard({ method }: { method: PayMethod }) {
  const bg =
    method.type === "card"
      ? (CARD_BG[method.brand ?? ""] ?? FALLBACK_BG)
      : (TYPE_BG[method.type] ?? FALLBACK_BG);

  const brandName =
    method.type === "card" && method.brand ? method.brand : method.type;
  const nickname = method.label.trim();

  return (
    <div
      className="w-full rounded-xl p-4 flex flex-col justify-between relative overflow-hidden"
      style={{ background: bg, minHeight: 88 }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10 bg-white pointer-events-none" />
      <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full opacity-10 bg-white pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <PaymentMethodLogo
          type={method.type}
          brand={method.brand}
          width={36}
          height={22}
        />
        {method.last4 && (
          <span className="font-mono text-[11px] text-white/60 tracking-widest">
            ···· {method.last4}
          </span>
        )}
      </div>

      <div className="relative mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-white font-bold text-sm leading-tight">
            {brandName}
          </p>
          {method.expiry && (
            <p className="text-white/50 text-[10px] font-semibold tracking-widest uppercase mt-0.5">
              Exp {method.expiry}
            </p>
          )}
        </div>
        {nickname && (
          <p className="text-white/40 text-[10px] font-medium shrink-0">
            {nickname}
          </p>
        )}
      </div>
    </div>
  );
}

interface Props {
  sub: Doc<"subscriptions">;
}

export function SubscriptionDetailsCard({ sub }: Props) {
  const paymentMethods = useQuery(api.paymentMethods.getPaymentMethods);

  const method = sub.paymentMethodId
    ? (paymentMethods ?? []).find((m) => m._id === sub.paymentMethodId)
    : null;

  const cycleLabel =
    sub.cycle === "custom" && sub.customInterval
      ? `Custom · ${sub.customInterval}`
      : (CYCLE_LABELS[sub.cycle] ?? sub.cycle);

  const MethodIcon = method ? (METHOD_ICONS[method.type] ?? Wallet) : null;

  const hasReminders = sub.remindersEnabled && sub.reminderIntervals.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-foreground">Details</h2>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {/* Billing + Payment grid */}
        <div className="grid grid-cols-2 gap-px bg-border">
          {/* Billing cycle */}
          <div className="bg-surface p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-muted">
              <Repeat size={13} color="currentColor" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Billing
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {cycleLabel}
              {sub.amountApprox && (
                <span className="ml-1.5 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/5 text-muted border border-border align-middle">
                  ~approx
                </span>
              )}
            </p>
          </div>

          {/* Payment mode */}
          <div className="bg-surface p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-muted">
              <Flash size={13} color="currentColor" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Mode
              </span>
            </div>
            {sub.paymentMode === "auto" ? (
              <span
                className="self-start text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-lg"
                style={{
                  backgroundColor: "rgba(124,92,252,0.12)",
                  color: "var(--color-primary)",
                  border: "1px solid rgba(124,92,252,0.25)",
                }}
              >
                Auto-Pay
              </span>
            ) : (
              <span
                className="self-start text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-lg"
                style={{
                  backgroundColor: "rgba(160,160,175,0.08)",
                  color: "var(--color-muted)",
                  border: "1px solid rgba(160,160,175,0.2)",
                }}
              >
                Manual
              </span>
            )}
          </div>

          {/* Payment method card */}
          {method && MethodIcon && (
            <div className="bg-surface p-4 flex flex-col gap-3 col-span-2 border-t border-border">
              <div className="flex items-center gap-1.5 text-muted">
                <MethodIcon size={13} color="currentColor" />
                <span className="text-[10px] font-semibold tracking-widest uppercase">
                  Pay With
                </span>
              </div>
              <PayWithCard method={method} />
            </div>
          )}
        </div>

        {/* Split Bill */}
        {sub.totalAmount && sub.splitCount && (
          <div className="border-t border-border p-4 flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-muted">
              <People size={13} color="currentColor" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Split Bill
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1 bg-white/3 border border-border rounded-lg px-3 py-2.5">
                <span className="text-[9px] font-semibold tracking-widest uppercase text-muted">
                  Full Cost
                </span>
                <span className="text-sm font-bold text-foreground font-mono">
                  {formatAmount(sub.totalAmount, sub.currency)}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-white/3 border border-border rounded-lg px-3 py-2.5">
                <span className="text-[9px] font-semibold tracking-widest uppercase text-muted">
                  Split
                </span>
                <span className="text-sm font-bold text-foreground">
                  {sub.splitCount} people
                </span>
              </div>
              <div
                className="flex flex-col gap-1 rounded-lg px-3 py-2.5"
                style={{
                  backgroundColor: "rgba(124,92,252,0.08)",
                  border: "1px solid rgba(124,92,252,0.2)",
                }}
              >
                <div className="flex items-center gap-1">
                  <Moneys size={10} color="var(--color-primary)" />
                  <span
                    className="text-[9px] font-semibold tracking-widest uppercase"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Your Share
                  </span>
                </div>
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: "var(--color-primary)" }}
                >
                  {formatAmount(sub.amount, sub.currency)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Reminders */}
        <div className="border-t border-border p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted">
              {hasReminders ? (
                <NotificationBing size={13} color="var(--color-primary)" />
              ) : (
                <Notification size={13} color="currentColor" />
              )}
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Reminders
              </span>
            </div>
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
              style={
                sub.remindersEnabled
                  ? {
                      backgroundColor: "rgba(124,92,252,0.08)",
                      color: "var(--color-primary)",
                      border: "1px solid rgba(124,92,252,0.2)",
                    }
                  : {
                      backgroundColor: "rgba(160,160,175,0.08)",
                      color: "var(--color-muted)",
                      border: "1px solid rgba(160,160,175,0.15)",
                    }
              }
            >
              {sub.remindersEnabled ? "On" : "Off"}
            </span>
          </div>

          {hasReminders ? (
            <div className="flex flex-wrap gap-1.5">
              {sub.reminderIntervals.map((interval) => (
                <span
                  key={interval}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: "rgba(124,92,252,0.08)",
                    color: "var(--color-primary)",
                    border: "1px solid rgba(124,92,252,0.18)",
                  }}
                >
                  {formatInterval(interval)} before
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">No reminders configured.</p>
          )}
        </div>

        {/* Notes */}
        {sub.notes && (
          <div className="border-t border-border p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-muted">
              <Note size={13} color="currentColor" />
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                Notes
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word">
              {sub.notes}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
