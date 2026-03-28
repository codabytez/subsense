"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Notification,
  Shield,
  Edit2,
  DocumentDownload,
  CloseSquare,
  Moon,
  Sun,
  Monitor,
  Setting2,
  Calendar,
  Crown,
  Repeat,
  MessageQuestion,
  LogoutCurve,
} from "iconsax-reactjs";
import { toast } from "sonner";
import { FadeIn } from "@/components/motion";
import { FilterChip } from "@/components/ui";
import { Section, Toggle } from "@/components/dashboard/settings";
import { CategoriesSection } from "@/components/dashboard/settings/categories-section";
import { PaymentMethodsSection } from "@/components/dashboard/settings/payment-methods-section";
import { DeleteAccountModal } from "@/components/dashboard/settings/delete-account-modal";
import { ChangePasswordModal } from "@/components/dashboard/settings/change-password-modal";
import { SignOutModal } from "@/components/dashboard/sign-out-modal";
import Image from "next/image";
import Link from "next/link";
import { useTheme, type Theme } from "@/providers/theme-provider";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

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

const AVATAR_STYLES = [
  "micah",
  "adventurer",
  "lorelei",
  "notionists",
  "fun-emoji",
  "pixel-art",
];

function avatarUrl(style: string, seed: string) {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
}

function randomSeed() {
  return Math.random().toString(36).slice(2, 10);
}

function currencyOption(code: string) {
  return CURRENCIES.find((c) => c.startsWith(code)) ?? CURRENCIES[0];
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Bone({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl bg-surface animate-pulse", className)} />
  );
}

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <Bone className="h-9 w-56" />
          <Bone className="h-4 w-72" />
        </div>
        <Bone className="h-14 w-48 rounded-2xl shrink-0" />
      </div>

      {/* Row 1: Profile + General */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-6">
            <Bone className="w-24 h-24 rounded-full shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Bone className="h-3 w-20" />
                <Bone className="h-12" />
              </div>
              <div className="flex flex-col gap-2">
                <Bone className="h-3 w-24" />
                <Bone className="h-12" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5">
          <Bone className="h-4 w-24" />
          <div className="flex flex-col gap-3">
            <Bone className="h-3 w-32" />
            <Bone className="h-12" />
          </div>
          <div className="flex flex-col gap-3">
            <Bone className="h-3 w-32" />
            <div className="flex gap-2">
              <Bone className="h-10 w-20" />
              <Bone className="h-10 w-20" />
              <Bone className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Notifications + Categories + Data & Privacy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4"
          >
            <Bone className="h-4 w-28" />
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((j) => (
                <div key={j} className="flex items-center justify-between py-1">
                  <div className="flex flex-col gap-1.5">
                    <Bone className="h-3.5 w-32" />
                    <Bone className="h-3 w-44" />
                  </div>
                  <Bone className="h-7 w-14 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Row 3: Payment Methods */}
      <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
        <Bone className="h-4 w-36" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Bone key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  const user = useQuery(api.users.getCurrentUser);
  const rawSubs = useQuery(api.subscriptions.getSubscriptions);
  const updateProfile = useMutation(api.users.updateProfile);
  const updateAvatar = useMutation(api.users.updateAvatar);
  const updateNotifPrefs = useMutation(api.users.updateNotificationPreferences);
  const { theme, setTheme } = useTheme();
  const [editedName, setEditedName] = useState<string | null>(null);
  const [editedCurrency, setEditedCurrency] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savingNotif, setSavingNotif] = useState<
    "mute" | "digest" | "price" | null
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerOptions, setPickerOptions] = useState<
    { style: string; seed: string }[]
  >([]);

  const displayName = editedName ?? user?.name ?? "";
  const displayCurrency =
    editedCurrency ??
    (user?.currency ? currencyOption(user.currency) : CURRENCIES[0]);

  const isDirty =
    (editedName !== null && editedName !== user?.name) ||
    (editedCurrency !== null && editedCurrency.slice(0, 3) !== user?.currency);

  function discard() {
    setEditedName(null);
    setEditedCurrency(null);
  }

  function exportCsv() {
    const subs = rawSubs ?? [];
    const headers = [
      "Name",
      "Plan",
      "Amount",
      "Currency",
      "Cycle",
      "Status",
      "Category",
      "Next Payment Date",
      "Payment Mode",
      "Notes",
    ];
    const rows = subs.map((s) =>
      [
        s.name,
        s.plan ?? "",
        s.amount.toFixed(2),
        s.currency,
        s.cycle,
        s.status,
        s.category,
        s.nextPaymentDate ?? "",
        s.paymentMode,
        s.notes ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subsense-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function save() {
    if (!displayName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({
        name: displayName.trim(),
        currency: displayCurrency.slice(0, 3),
      });
      setEditedName(null);
      setEditedCurrency(null);
    } finally {
      setIsSaving(false);
    }
  }

  function openPicker() {
    const options = AVATAR_STYLES.map((style) => ({
      style,
      seed: randomSeed(),
    }));
    setPickerOptions(options);
    setShowPicker(true);
  }

  async function selectAvatar(style: string, seed: string) {
    const url = avatarUrl(style, seed);
    setShowPicker(false);
    await updateAvatar({ avatarUrl: url });
  }

  const avatar = user?.avatarUrl;

  if (user === undefined) return <SettingsSkeleton />;

  return (
    <>
      <FadeIn className="flex flex-col gap-6 pb-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Account Settings
            </h1>
            <p className="text-sm text-muted mt-1">
              Manage your subscription ecosystem and security vault.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0 bg-neutral rounded-2xl overflow-hidden pr-5">
            <div className="relative w-14 h-14 bg-primary flex items-center justify-center shrink-0 overflow-hidden">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-lg font-black text-white">
                  {user?.name ? initials(user.name) : "—"}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {user?.name ?? "—"}
              </p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-primary">
                Free Plan
              </p>
            </div>
          </div>
        </div>

        {/* Row 1: Profile + General */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          {/* Profile */}
          <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="relative shrink-0 self-center sm:self-auto">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-2 flex items-center justify-center text-2xl font-black text-white overflow-hidden bg-primary ring-border">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="avatar"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : user?.name ? (
                    initials(user.name)
                  ) : (
                    "—"
                  )}
                </div>
                <button
                  onClick={openPicker}
                  className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Edit2 size={13} color="#fff" />
                </button>
              </div>
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                    Full Name
                  </p>
                  <input
                    value={displayName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-neutral rounded-lg px-4 py-3 text-base font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                    Email Address
                  </p>
                  <input
                    value={user?.email ?? ""}
                    readOnly
                    className="w-full bg-neutral rounded-lg px-4 py-3 text-base font-semibold text-muted outline-none cursor-not-allowed select-none"
                  />
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="text-xs font-bold text-primary hover:opacity-70 transition-opacity text-left"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Profile stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2 sm:gap-3 bg-neutral rounded-xl px-3 sm:px-4 py-3">
                <Calendar
                  size={16}
                  color="var(--color-muted)"
                  variant="Bold"
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold tracking-widest uppercase text-muted">
                    Member Since
                  </p>
                  <p className="text-sm font-bold text-foreground whitespace-nowrap">
                    {user?._creationTime
                      ? new Date(user._creationTime).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 sm:gap-3 bg-neutral rounded-xl px-3 sm:px-4 py-3">
                <Crown
                  size={16}
                  color="var(--color-primary)"
                  variant="Bold"
                  className="shrink-0"
                />
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-muted">
                    Plan
                  </p>
                  <p className="text-sm font-bold text-foreground">Free</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-neutral rounded-xl px-3 sm:px-4 py-3">
                <Repeat
                  size={16}
                  color="var(--color-secondary)"
                  variant="Bold"
                  className="shrink-0"
                />
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase text-muted">
                    Active Subs
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {
                      (rawSubs ?? []).filter((s) => s.status === "active")
                        .length
                    }
                  </p>
                </div>
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
                  value={displayCurrency}
                  options={CURRENCIES}
                  onChange={setEditedCurrency}
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
                label="Mute All Notifications"
                description="Pause all emails and inbox alerts"
                checked={user?.notifMuteAll ?? false}
                disabled={savingNotif === "mute"}
                onChange={async (v) => {
                  setSavingNotif("mute");
                  try {
                    await updateNotifPrefs({
                      notifMuteAll: v,
                      notifEmailDigest: user?.notifEmailDigest ?? true,
                      notifPriceSensitivity:
                        user?.notifPriceSensitivity ?? false,
                    });
                  } finally {
                    setSavingNotif(null);
                  }
                }}
              />
              <Toggle
                label="Email Digests"
                description="Weekly spending reports"
                checked={user?.notifEmailDigest ?? true}
                disabled={
                  savingNotif === "digest" || (user?.notifMuteAll ?? false)
                }
                onChange={async (v) => {
                  setSavingNotif("digest");
                  try {
                    await updateNotifPrefs({
                      notifEmailDigest: v,
                      notifMuteAll: user?.notifMuteAll ?? false,
                      notifPriceSensitivity:
                        user?.notifPriceSensitivity ?? false,
                    });
                  } finally {
                    setSavingNotif(null);
                  }
                }}
              />
              <Toggle
                label="Price Sensitivity"
                description="Email alert when you update a subscription's amount"
                checked={user?.notifPriceSensitivity ?? false}
                disabled={
                  savingNotif === "price" || (user?.notifMuteAll ?? false)
                }
                onChange={async (v) => {
                  setSavingNotif("price");
                  try {
                    await updateNotifPrefs({
                      notifPriceSensitivity: v,
                      notifEmailDigest: user?.notifEmailDigest ?? true,
                      notifMuteAll: user?.notifMuteAll ?? false,
                    });
                  } finally {
                    setSavingNotif(null);
                  }
                }}
              />
            </div>
          </Section>

          <CategoriesSection />

          <Section icon={Shield} title="Data & Privacy">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={exportCsv}
                  className="flex flex-col items-center justify-center gap-3 py-5 rounded-xl bg-neutral hover:opacity-80 transition-opacity"
                >
                  <DocumentDownload size={28} color="var(--color-muted)" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted">
                    Export CSV
                  </span>
                </button>
                <div className="relative flex flex-col items-center justify-center gap-3 py-5 rounded-xl bg-neutral opacity-50 cursor-not-allowed">
                  <DocumentDownload size={28} color="var(--color-muted)" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted">
                    Export PDF
                  </span>
                  <span className="absolute top-2 right-2 text-[8px] font-black tracking-widest uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-neutral">
                <span className="text-sm font-semibold text-muted">
                  Version
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-foreground">
                  v{process.env.APP_VERSION}
                </span>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
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

        {/* Row 3: Payment Methods */}
        <PaymentMethodsSection />

        {/* Mobile-only: Support + Sign Out */}
        <div className="flex flex-col gap-2 md:hidden">
          <Link
            href="/dashboard/support"
            className="flex items-center gap-3 px-4 py-4 rounded-xl bg-surface border border-border hover:opacity-80 transition-opacity"
          >
            <MessageQuestion
              size={20}
              color="var(--color-muted)"
              variant="Outline"
            />
            <span className="text-sm font-semibold text-foreground">
              Support
            </span>
          </Link>
          <button
            onClick={() => setShowSignOut(true)}
            className="flex items-center gap-3 px-4 py-4 rounded-xl bg-surface border border-border hover:opacity-80 transition-opacity w-full"
          >
            <LogoutCurve
              size={20}
              color="var(--color-muted)"
              variant="Outline"
            />
            <span className="text-sm font-semibold text-foreground">
              Sign Out
            </span>
          </button>
        </div>
      </FadeIn>

      <DeleteAccountModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      <SignOutModal open={showSignOut} onClose={() => setShowSignOut(false)} />

      {/* Avatar picker */}
      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPicker(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              key="picker"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5 w-80 shadow-2xl"
            >
              <div>
                <p className="text-sm font-bold text-foreground">
                  Pick an avatar
                </p>
                <p className="text-[11px] text-muted mt-0.5">
                  Click one to set it as your profile picture
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {pickerOptions.map(({ style, seed }) => (
                  <button
                    key={`${style}-${seed}`}
                    onClick={() => selectAvatar(style, seed)}
                    className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral hover:ring-2 hover:ring-primary transition-all"
                  >
                    <Image
                      src={avatarUrl(style, seed)}
                      alt={style}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={openPicker}
                className="text-xs font-bold text-primary hover:opacity-70 transition-opacity text-center"
              >
                Shuffle options
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky footer — only visible when there are unsaved changes */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sticky -bottom-10 z-30 flex items-center justify-between px-8 py-5 border-t border-border bg-background/90 backdrop-blur-md -mx-4 md:-mx-8 -mb-4 md:-mb-8"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted">
              Unsaved changes
            </span>
            <div className="flex items-center gap-6">
              <button
                onClick={discard}
                disabled={isSaving}
                className="text-sm font-semibold text-muted hover:text-foreground transition-colors disabled:opacity-40"
              >
                Discard
              </button>
              <button
                onClick={save}
                disabled={isSaving}
                className="px-8 py-3.5 rounded-2xl text-sm font-black text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
