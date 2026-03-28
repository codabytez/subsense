"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Verify, ArrowRight } from "iconsax-reactjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { CalendarEvent } from "./calendar-grid";
import { Button } from "@/components/ui";
import { formatAmount } from "@/lib/currency";

function iconFromSub(sub: CalendarEvent): {
  bg: string;
  color: string;
  initials: string;
} {
  const m = sub.iconColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const bg = m ? `rgb(${m[1]},${m[2]},${m[3]})` : "#2a2a35";
  const initials = sub.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return { bg, color: "#fff", initials };
}

function generateRefId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return (
    "SS-" +
    Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("")
  );
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function nextBillingDate(cycle: string): Date {
  const d = new Date();
  switch (cycle) {
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "annual":
      d.setFullYear(d.getFullYear() + 1);
      break;
    default:
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d;
}

interface PaymentConfirmModalProps {
  sub: CalendarEvent | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function PaymentConfirmModal({
  sub,
  onConfirm,
  onClose,
}: PaymentConfirmModalProps) {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [refId] = useState(generateRefId);
  const confirmPayment = useMutation(api.paymentLogs.confirmPayment);
  const paymentMethods = useQuery(api.paymentMethods.getPaymentMethods);

  const icon = sub ? iconFromSub(sub) : null;
  const today = new Date();

  const linkedMethod = sub?.paymentMethodId
    ? paymentMethods?.find((m) => m._id === sub.paymentMethodId)
    : null;
  const methodLabel = linkedMethod
    ? linkedMethod.last4
      ? `${linkedMethod.brand ?? linkedMethod.type} ···· ${linkedMethod.last4}`
      : linkedMethod.label
    : null;

  async function handleConfirm() {
    if (!sub) return;
    setIsConfirming(true);
    try {
      await confirmPayment({ subscriptionId: sub.id as Id<"subscriptions"> });
      setConfirmed(true);
      // onConfirm is called in handleClose so the modal stays mounted for the success screen
    } catch {
      setIsConfirming(false);
    }
  }

  function handleClose() {
    if (confirmed) onConfirm();
    setConfirmed(false);
    setIsConfirming(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {sub && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div
              className="w-full bg-surface border border-border rounded-2xl overflow-hidden"
              style={{ maxWidth: confirmed ? 480 : 672 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {!confirmed ? (
                  /* ── Checkout screen ── */
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {/* Left */}
                      <div className="p-8 border-b md:border-b-0 md:border-r border-border flex flex-col gap-6">
                        <div className="flex items-start justify-between">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-base font-black shrink-0"
                            style={{
                              backgroundColor: icon!.bg,
                              color: icon!.color,
                            }}
                          >
                            {icon!.initials}
                          </div>
                          <span
                            className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded"
                            style={{
                              backgroundColor: "rgba(45,212,191,0.12)",
                              color: "var(--color-secondary)",
                              border: "1px solid rgba(45,212,191,0.25)",
                            }}
                          >
                            Active Plan
                          </span>
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {sub.name}
                          </h2>
                          <p className="text-sm text-muted mt-1">
                            {sub.cycle.charAt(0).toUpperCase() +
                              sub.cycle.slice(1)}{" "}
                            · {formatAmount(sub.amount, sub.currency)}
                          </p>
                        </div>

                        {sub.notes && (
                          <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
                              Notes
                            </p>
                            <p className="text-sm text-muted leading-relaxed">
                              {sub.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right */}
                      <div className="p-8 flex flex-col gap-6">
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-4">
                            Payment Breakdown
                          </p>
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted">Subtotal</span>
                              <span className="text-foreground font-mono">
                                {formatAmount(sub.amount, sub.currency)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted">Tax (0%)</span>
                              <span className="text-foreground font-mono">
                                {formatAmount(0, sub.currency)}
                              </span>
                            </div>
                            <div className="h-px bg-border my-1" />
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-foreground">
                                Total Due Today
                              </span>
                              <span className="text-xl font-bold font-mono text-primary">
                                {formatAmount(sub.amount, sub.currency)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {methodLabel && (
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-3">
                              Payment Method
                            </p>
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background">
                              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                <svg
                                  width="16"
                                  height="12"
                                  viewBox="0 0 16 12"
                                  fill="none"
                                >
                                  <rect
                                    width="16"
                                    height="12"
                                    rx="2"
                                    fill="#1a1a2e"
                                  />
                                  <rect
                                    x="1"
                                    y="4"
                                    width="14"
                                    height="2"
                                    fill="#444"
                                  />
                                  <rect
                                    x="1"
                                    y="8"
                                    width="4"
                                    height="1.5"
                                    rx="0.5"
                                    fill="#666"
                                  />
                                </svg>
                              </div>
                              <p className="text-sm font-bold text-foreground">
                                {methodLabel}
                              </p>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleConfirm}
                          disabled={isConfirming}
                          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          {isConfirming ? "Processing..." : "Confirm Payment"}
                        </button>

                        <p className="text-[10px] text-muted text-center leading-relaxed">
                          By confirming, you acknowledge this subscription has
                          been paid. SubSense will record it in your payment
                          history.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Success screen ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col items-center px-8 py-10 gap-6"
                  >
                    {/* Badge */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className="absolute w-32 h-32 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(124,92,252,0.2) 0%, transparent 65%)",
                        }}
                      />
                      <div
                        className="relative w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#0e0e13" }}
                      >
                        <Verify
                          size={40}
                          color="var(--color-primary)"
                          variant="Bold"
                        />
                      </div>
                    </div>

                    <p className="text-sm text-muted">
                      Transaction processed successfully.
                    </p>

                    {/* Receipt card */}
                    <div
                      className="w-full rounded-2xl overflow-hidden p-5 flex flex-col gap-5"
                      style={{ backgroundColor: "#0e0e13" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
                            Service
                          </p>
                          <p className="text-lg font-bold text-foreground mt-1">
                            {sub.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
                            Amount
                          </p>
                          <p className="text-2xl font-black font-mono text-primary mt-1">
                            {formatAmount(sub.amount, sub.currency)}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-border" />

                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Reference ID", value: refId },
                          { label: "Date", value: formatDate(today) },
                          {
                            label: "Next Billing",
                            value: formatDate(nextBillingDate(sub.cycle)),
                          },
                          {
                            label: "Status",
                            value: (
                              <span className="flex items-center gap-1.5 text-secondary font-bold text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                SETTLED
                              </span>
                            ),
                          },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
                              {label}
                            </p>
                            <div className="text-sm font-semibold text-foreground mt-1">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                      <Button
                        size="lg"
                        onClick={() => {
                          handleClose();
                          router.push("/dashboard");
                        }}
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        Go to Dashboard
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
