"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldTick, Award, Verify, ArrowRight } from "iconsax-reactjs";
import type { CalendarEvent } from "./calendar-grid";
import { Button } from "@/components/ui";

const ICON_CONFIG: Record<
  string,
  { bg: string; color: string; initials: string }
> = {
  "Adobe CC": { bg: "#e8453c", color: "#fff", initials: "Cc" },
  "X Premium": { bg: "#111113", color: "#fff", initials: "X" },
  Spotify: { bg: "#1db954", color: "#fff", initials: "S" },
  Netflix: { bg: "#e50914", color: "#fff", initials: "N" },
  "GitHub Pro": { bg: "#24292e", color: "#fff", initials: "Gh" },
  Figma: { bg: "#f24e1e", color: "#fff", initials: "Fi" },
  Linear: { bg: "#5e6ad2", color: "#fff", initials: "Li" },
  Notion: { bg: "#ffffff", color: "#111", initials: "No" },
  "ChatGPT Plus": { bg: "#10a37f", color: "#fff", initials: "Ai" },
  "iCloud+": { bg: "#3478f6", color: "#fff", initials: "iC" },
};

const BENEFITS: Record<string, string[]> = {
  "Adobe CC": [
    "Access to all Creative Cloud apps",
    "100GB cloud storage",
    "Adobe Fonts & Stock",
  ],
  Figma: [
    "Unlimited projects & editors",
    "Advanced prototyping & dev mode",
    "Private plugins and widgets",
  ],
  "X Premium": [
    "Blue verification badge",
    "Longer posts & video uploads",
    "Reduced ads experience",
  ],
  Linear: [
    "Unlimited issues & cycles",
    "Advanced analytics & roadmaps",
    "Priority support",
  ],
  Notion: [
    "Unlimited blocks & pages",
    "Unlimited file uploads",
    "Version history",
  ],
  "ChatGPT Plus": [
    "GPT-4o access & advanced features",
    "Faster response times",
    "Access to new features first",
  ],
};

function getIcon(name: string) {
  return (
    ICON_CONFIG[name] ?? {
      bg: "#2a2a35",
      color: "#fff",
      initials: name.slice(0, 2),
    }
  );
}

function getBenefits(name: string): string[] {
  return (
    BENEFITS[name] ?? [
      "Full access to all features",
      "Priority support",
      "Regular updates included",
    ]
  );
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
  const [refId] = useState(generateRefId);

  const icon = sub ? getIcon(sub.name) : null;
  const benefits = sub ? getBenefits(sub.name) : [];

  const today = new Date();
  const nextBilling = new Date(today);
  nextBilling.setMonth(nextBilling.getMonth() + 1);

  function handleConfirm() {
    setConfirmed(true);
    // onConfirm is called on close so the parent doesn't unmount us before success screen shows
  }

  function handleClose() {
    if (confirmed) onConfirm();
    setConfirmed(false);
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
                            Monthly · ${sub.amount.toFixed(2)}/mo
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
                            Service Benefits
                          </p>
                          {benefits.map((b) => (
                            <div key={b} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                                <svg
                                  width="8"
                                  height="8"
                                  viewBox="0 0 8 8"
                                  fill="none"
                                >
                                  <path
                                    d="M1.5 4L3 5.5L6.5 2"
                                    stroke="var(--color-secondary)"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm text-muted">{b}</span>
                            </div>
                          ))}
                        </div>
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
                                ${sub.amount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted">Tax (0%)</span>
                              <span className="text-foreground font-mono">
                                $0.00
                              </span>
                            </div>
                            <div className="h-px bg-border my-1" />
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-foreground">
                                Total Due Today
                              </span>
                              <span className="text-xl font-bold font-mono text-primary">
                                ${sub.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

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
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground">
                                Apple Card
                              </p>
                              <p className="text-xs text-muted">•••• 8821</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleConfirm}
                          className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          Confirm Payment
                        </button>

                        <p className="text-[10px] text-muted text-center leading-relaxed">
                          By confirming, you acknowledge this subscription has
                          been paid. SubSense will record it in your payment
                          history.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 py-4 border-t border-border">
                      {[
                        { icon: Lock, label: "SSL Encrypted" },
                        { icon: ShieldTick, label: "PCI Compliant" },
                        { icon: Award, label: "SubSense Secure" },
                      ].map(({ icon: Icon, label }) => (
                        <div
                          key={label}
                          className="flex items-center gap-1.5 text-muted"
                        >
                          <Icon size={13} color="currentColor" />
                          <span className="text-[10px] font-bold tracking-wider uppercase">
                            {label}
                          </span>
                        </div>
                      ))}
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

                    {/* Subtitle only — no heading */}
                    <p className="text-sm text-muted">
                      Transaction processed successfully.
                    </p>

                    {/* Receipt card */}
                    <div
                      className="w-full rounded-2xl overflow-hidden p-5 flex flex-col gap-5"
                      style={{ backgroundColor: "#0e0e13" }}
                    >
                      {/* Top row */}
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
                            ${sub.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-border" />

                      {/* Bottom 2×2 grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Reference ID", value: refId },
                          { label: "Date", value: formatDate(today) },
                          {
                            label: "Next Billing",
                            value: formatDate(nextBilling),
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

                    {/* Actions */}
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

                    {/* Footer */}
                    <div className="flex items-center gap-1.5 text-muted">
                      <Lock size={12} color="currentColor" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">
                        SubSense Secure Transaction Node
                      </span>
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
