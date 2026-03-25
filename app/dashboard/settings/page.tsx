"use client";

import { useState } from "react";
import {
  Notification,
  Shield,
  CardPos,
  Category,
  Edit2,
  DocumentDownload,
  Cloud,
  CloseSquare,
  Moon,
  Sun,
  Monitor,
  Setting2,
} from "iconsax-reactjs";
import { FadeIn } from "@/components/motion";
import { FilterChip } from "@/components/ui";
import { Section, Toggle, CardChip } from "@/components/dashboard/settings";
import { useTheme, type Theme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Entertainment", color: "var(--color-secondary)" },
  { label: "Productivity", color: "var(--color-primary)" },
  { label: "Wellness", color: "var(--color-tertiary)" },
];

const THEMES: { label: Theme; icon: React.ElementType }[] = [
  { label: "Dark", icon: Moon },
  { label: "Light", icon: Sun },
  { label: "Auto", icon: Monitor },
];

const CURRENCIES = [
  "USD ($) — United States Dollar",
  "EUR (€) — Euro",
  "GBP (£) — British Pound",
  "JPY (¥) — Japanese Yen",
  "CAD (C$) — Canadian Dollar",
  "AUD (A$) — Australian Dollar",
  "CHF (Fr) — Swiss Franc",
  "NGN (₦) — Nigerian Naira",
  "INR (₹) — Indian Rupee",
  "CNY (¥) — Chinese Yuan",
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  return (
    <>
      <FadeIn className="flex flex-col gap-6 pb-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Account Settings
            </h1>
            <p className="text-sm text-muted mt-1">
              Manage your subscription ecosystem and security vault.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 bg-neutral rounded-2xl overflow-hidden pr-5">
            <div className="w-14 h-14 bg-[#c8a882] flex items-center justify-center shrink-0 overflow-hidden">
              <span className="text-lg font-black text-white">AS</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Alex Sterling</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
                Premium Member
              </p>
            </div>
          </div>
        </div>

        {/* Row 1: Profile + General */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          {/* Profile */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full ring-2 flex items-center justify-center text-2xl font-black text-white overflow-hidden bg-primary ring-border">
                  AS
                </div>
                <button
                  className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Edit2 size={13} color="#fff" />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                    Full Name
                  </p>
                  <input
                    defaultValue="Alex Sterling"
                    className="w-full bg-neutral rounded-lg px-4 py-3 text-base font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                    Email Address
                  </p>
                  <input
                    defaultValue="alex.sterling@vault.finance"
                    className="w-full bg-neutral rounded-lg px-4 py-3 text-base font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4 rounded-xl bg-neutral">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
                  Current Plan
                </p>
                <p className="text-xl font-bold text-foreground mt-1">
                  Premium Tier Vault
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted">
                  Billing Cycle
                </p>
                <p className="text-xl font-bold text-foreground mt-1">
                  $24.00 / Annually
                </p>
              </div>
            </div>
          </div>

          {/* General */}
          <Section icon={Setting2} title="General">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                  Currency Preference
                </p>
                <FilterChip
                  value={currency}
                  options={CURRENCIES}
                  onChange={setCurrency}
                  size="lg"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                  Theme Preference
                </p>
                <div className="flex items-center gap-2">
                  {THEMES.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => setTheme(label)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                        theme === label
                          ? "bg-primary/20 text-primary"
                          : "text-muted hover:text-foreground"
                      )}
                    >
                      <Icon size={15} color="currentColor" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Row 2: Notifications + Categories + Data & Privacy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Section icon={Notification} title="Notifications">
            <div className="flex flex-col divide-y divide-border">
              <Toggle
                label="Push Notifications"
                description="Real-time subscription alerts"
                defaultChecked
              />
              <Toggle
                label="Email Digests"
                description="Weekly spending reports"
                defaultChecked
              />
              <Toggle
                label="Price Sensitivity"
                description="Alert on 5%+ price increases"
              />
            </div>
          </Section>

          <Section
            icon={Category}
            title="Categories"
            action={
              <button className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-primary hover:opacity-80 transition-opacity">
                + Add New
              </button>
            }
          >
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(({ label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl bg-neutral"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-base font-bold text-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Shield} title="Data & Privacy">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center gap-3 py-5 rounded-xl bg-neutral hover:opacity-80 transition-opacity">
                  <DocumentDownload size={28} color="var(--color-muted)" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted">
                    Export CSV
                  </span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 py-5 rounded-xl bg-neutral hover:opacity-80 transition-opacity">
                  <DocumentDownload size={28} color="var(--color-muted)" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted">
                    Export PDF
                  </span>
                </button>
              </div>
              <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-neutral">
                <div className="flex items-center gap-3">
                  <Cloud size={22} color="var(--color-muted)" />
                  <span className="text-base font-bold text-foreground">
                    Cloud Backup
                  </span>
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-secondary">
                  Active
                </span>
              </div>
              <button
                className="flex items-center gap-3 px-4 py-4 rounded-xl hover:opacity-90 transition-opacity w-full"
                style={{ backgroundColor: "rgba(249,112,102,0.12)" }}
              >
                <CloseSquare size={22} color="var(--color-tertiary)" />
                <span className="text-base font-bold text-tertiary">
                  Terminate Account
                </span>
              </button>
            </div>
          </Section>
        </div>

        {/* Row 3: Linked Cards */}
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardPos size={16} color="var(--color-primary)" variant="Bold" />
              <p className="text-xs font-bold tracking-widest uppercase text-foreground">
                Linked Cards
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-[10px] font-bold tracking-widest uppercase text-muted hover:text-foreground hover:border-border/80 transition-colors">
              <CardPos size={13} color="currentColor" />
              Add New Card
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <CardChip
              brand="Apple Card"
              last4="8821"
              status="PRIMARY"
              expires="09/27"
              logo={
                <span className="text-sm font-black text-white tracking-tighter">
                  PPL
                </span>
              }
            />
            <CardChip
              brand="Chase Sapphire"
              last4="4242"
              status="ACTIVE"
              expires="04/26"
              logo={
                <div
                  className="w-full h-full flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#1a1fc8" }}
                >
                  <span className="text-xs font-black text-white tracking-tight">
                    VISA
                  </span>
                </div>
              }
            />
            <CardChip
              brand="Mastercard"
              last4="9012"
              status="ACTIVE"
              expires="11/25"
              logo={
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-red-500" />
                  <div
                    className="w-6 h-6 rounded-full -ml-3 mix-blend-multiply"
                    style={{ backgroundColor: "#f5a623" }}
                  />
                </div>
              }
            />
          </div>
        </div>
      </FadeIn>

      {/* Sticky footer */}
      <div className="sticky -bottom-10 z-30 flex items-center justify-between px-8 py-5 border-t border-border bg-background/90 backdrop-blur-md -mx-4 md:-mx-8 -mb-4 md:-mb-8">
        <span className="text-[10px] font-bold tracking-widest uppercase text-muted">
          SubSense V1.0.0-Stable
        </span>
        <div className="flex items-center gap-6">
          <button className="text-sm font-semibold text-muted hover:text-foreground transition-colors">
            Discard Changes
          </button>
          <button
            className="px-8 py-3.5 rounded-2xl text-sm font-black text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
