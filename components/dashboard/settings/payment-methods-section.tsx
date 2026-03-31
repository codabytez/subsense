"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation } from "convex/react";
import {
  Edit2,
  Trash,
  CardPos,
  Star1,
  Add,
  Bank,
  Wallet,
  Card,
} from "iconsax-reactjs";

import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

// ── Brand / type icon component ────────────────────────────────
import mastercardSvg from "@/public/cards/Mastercard.svg";
import visaSvg from "@/public/cards/Visa.svg";
import amexSvg from "@/public/cards/Amex.svg";
import discoverSvg from "@/public/cards/Discover.svg";
import verveSvg from "@/public/cards/Verve.svg";
import paypalSvg from "@/public/cards/PayPal.svg";
import applePaySvg from "@/public/cards/ApplePay.svg";
import googlePaySvg from "@/public/cards/GooglePay.svg";
import yandexSvg from "@/public/cards/Yandex.svg";
import Image from "next/image";

// ── Constants ─────────────────────────────────────────────────
type PaymentType =
  | "card"
  | "paypal"
  | "apple_pay"
  | "google_pay"
  | "bank"
  | "other";

const TYPES: { value: PaymentType; label: string }[] = [
  { value: "card", label: "Card" },
  { value: "paypal", label: "PayPal" },
  { value: "apple_pay", label: "Apple Pay" },
  { value: "google_pay", label: "Google Pay" },
  { value: "bank", label: "Bank" },
  { value: "other", label: "Other" },
];

const CARD_BRANDS = [
  "Visa",
  "Mastercard",
  "Amex",
  "Discover",
  "Verve",
  "Other",
];

interface PaymentMethod {
  _id: Id<"paymentMethods">;
  type: PaymentType;
  label: string;
  brand?: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
}

type MethodIconProps = {
  type: PaymentType;
  brand?: string;
  size?: "md" | "sm";
};

function MethodIcon({ type, brand, size = "md" }: MethodIconProps) {
  const dim = size === "md" ? "w-7 h-7" : "w-6 h-6";
  const radius = size === "md" ? "rounded-xl" : "rounded-lg";

  if (type === "card") {
    if (brand === "Visa") {
      return <Image src={visaSvg} alt="Visa" />;
    }
    if (brand === "Mastercard") {
      return <Image src={mastercardSvg} alt="Mastercard" />;
    }
    if (brand === "Amex") {
      return <Image src={amexSvg} alt="Amex" />;
    }
    if (brand === "Discover") {
      return <Image src={discoverSvg} alt="Discover" />;
    }
    if (brand === "Verve") {
      return <Image src={verveSvg} alt="Verve" />;
    }
    // Generic card
    return <Image src={yandexSvg} alt="Card" />;
  }

  if (type === "paypal") {
    return <Image src={paypalSvg} alt="PayPal" />;
  }

  if (type === "apple_pay") {
    return <Image src={applePaySvg} alt="Apple Pay" />;
  }

  if (type === "google_pay") {
    return <Image src={googlePaySvg} alt="Google Pay" />;
  }

  if (type === "bank") {
    return (
      <div
        className="h-6 w-10 rounded flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#22C55E" }}
      >
        <Bank size={16} color="#fff" />
      </div>
    );
  }

  // other
  return (
    <div
      className={`${dim} ${radius} flex items-center justify-center shrink-0`}
      style={{ backgroundColor: "#64748B" }}
    >
      <Wallet size={size === "md" ? 20 : 16} color="#fff" />
    </div>
  );
}

function typeLabel(type: PaymentType) {
  return TYPES.find((t) => t.value === type)?.label ?? type;
}

function methodDisplayName(m: {
  type: PaymentType;
  label: string;
  brand?: string;
  last4?: string;
}) {
  if (m.type === "card" && m.brand) {
    return m.last4 ? `${m.brand} ···${m.last4}` : m.brand;
  }
  return m.label || typeLabel(m.type);
}

// ── Method chip (preview) ─────────────────────────────────────
function MethodChip({
  method,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  method: PaymentMethod;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  return (
    <div className="bg-neutral rounded-2xl p-5 flex flex-col gap-4 group">
      <div className="flex items-start justify-between">
        <MethodIcon type={method.type} brand={method.brand} size="md" />
        <div className="flex items-center gap-1">
          {method.isDefault && (
            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded bg-primary/15 text-primary">
              Default
            </span>
          )}
          {/* Actions — always visible on mobile, hover-only on desktop */}
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            {!method.isDefault && (
              <button
                onClick={onSetDefault}
                title="Set as default"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-border/50 transition-colors"
              >
                <Star1 size={13} color="var(--color-muted)" />
              </button>
            )}
            <button
              onClick={onEdit}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-border/50 transition-colors"
            >
              <Edit2 size={13} color="var(--color-muted)" />
            </button>
            <button
              onClick={onDelete}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-tertiary/10 transition-colors"
            >
              <Trash size={13} color="var(--color-tertiary)" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-base font-bold text-foreground leading-tight">
          {methodDisplayName(method)}
        </p>
        {method.type === "card" && method.expiry ? (
          <p className="text-[11px] text-muted mt-0.5 uppercase tracking-widest">
            Expires {method.expiry}
          </p>
        ) : (
          <p className="text-[11px] text-muted mt-0.5">
            {typeLabel(method.type)}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Add / Edit modal ──────────────────────────────────────────
type FormValues = {
  type: PaymentType;
  label: string;
  brand: string;
  last4: string;
  expiry: string;
};

const TYPE_META: {
  value: PaymentType;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { value: "card", label: "Card", icon: <Card size={28} />, color: "#6366F1" },
  {
    value: "paypal",
    label: "PayPal",
    icon: <Image src={paypalSvg} alt="PayPal" width={28} height={28} />,
    color: "#003087",
  },
  {
    value: "apple_pay",
    label: "Apple Pay",
    icon: <Image src={applePaySvg} alt="Apple Pay" width={28} height={28} />,
    color: "#1C1C1E",
  },
  {
    value: "google_pay",
    label: "Google Pay",
    icon: <Image src={googlePaySvg} alt="Google Pay" width={28} height={28} />,
    color: "#4285F4",
  },
  { value: "bank", label: "Bank", icon: <Bank size={28} />, color: "#22C55E" },
  {
    value: "other",
    label: "Other",
    icon: <Wallet size={28} />,
    color: "#64748B",
  },
];

/** Live card preview */
function CardPreview({ form }: { form: FormValues }) {
  const isCard = form.type === "card";
  const displayName = isCard ? form.brand || "Card" : typeLabel(form.type);
  const nickname = form.label.trim();

  const bgMap: Record<string, string> = {
    Visa: "linear-gradient(135deg, #1A1F71 0%, #3451B2 100%)",
    Mastercard: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    Amex: "linear-gradient(135deg, #007BC1 0%, #0056A0 100%)",
    Discover: "linear-gradient(135deg, #FF6600 0%, #cc5200 100%)",
    Verve: "linear-gradient(135deg, #00A86B 0%, #007a4d 100%)",
    Other: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
  };

  const typeBgMap: Record<string, string> = {
    paypal: "linear-gradient(135deg, #003087 0%, #001f5e 100%)",
    apple_pay: "linear-gradient(135deg, #1C1C1E 0%, #000 100%)",
    google_pay: "linear-gradient(135deg, #4285F4 0%, #1a56cc 100%)",
    bank: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
    other: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
  };

  const bg = isCard
    ? (bgMap[form.brand] ?? "linear-gradient(135deg, #374151 0%, #1f2937 100%)")
    : (typeBgMap[form.type] ??
      "linear-gradient(135deg, #374151 0%, #1f2937 100%)");

  return (
    <div
      className="w-full rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
      style={{ background: bg, minHeight: 130 }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white" />
      <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full opacity-10 bg-white" />

      <div className="relative flex items-start justify-between">
        <MethodIcon type={form.type} brand={form.brand} size="sm" />
        {isCard && form.last4 && (
          <span className="font-mono text-xs text-white/70 tracking-widest">
            ···· {form.last4}
          </span>
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-white font-bold text-base leading-tight">
          {nickname || displayName}
        </p>
        {isCard && form.expiry && (
          <p className="text-white/50 text-[10px] font-semibold tracking-widest uppercase mt-0.5">
            Exp {form.expiry}
          </p>
        )}
      </div>
    </div>
  );
}

function PaymentMethodModal({
  initial,
  onSave,
  onClose,
  isSaving,
}: {
  initial: FormValues;
  onSave: (values: FormValues) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<FormValues>(initial);
  const set = (patch: Partial<FormValues>) =>
    setForm((f) => ({ ...f, ...patch }));

  const isCard = form.type === "card";
  const isValid = isCard ? form.brand.length > 0 : form.label.trim().length > 0;
  const isEdit = !!(initial.label || initial.brand);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface border border-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm flex flex-col shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Drag handle on mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-foreground">
              {isEdit ? "Edit method" : "Add payment method"}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-border/50 text-muted transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Live preview */}
          <CardPreview form={form} />

          {/* Type selector — icon cards */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TYPE_META.map(({ value, label, icon: Icon }) => {
                const active = form.type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set({ type: value, brand: "", label: "" })}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all",
                      active
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border text-muted hover:text-foreground hover:border-border/80"
                    )}
                  >
                    {Icon}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card-specific fields */}
          {isCard && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                  Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  {CARD_BRANDS.map((b) => {
                    const active = form.brand === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => set({ brand: b })}
                        className={cn(
                          "flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border text-xs font-semibold transition-all",
                          active
                            ? "border-primary/50 bg-primary/10 text-foreground"
                            : "border-border text-muted hover:text-foreground"
                        )}
                      >
                        <MethodIcon type="card" brand={b} size="sm" />
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                    Last 4 digits
                  </label>
                  <input
                    value={form.last4}
                    onChange={(e) =>
                      set({
                        last4: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    className="h-11 w-full bg-neutral border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted/40 outline-none focus:border-primary/50 transition-colors font-mono tracking-widest"
                    placeholder="4242"
                    maxLength={4}
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-24">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                    Expiry
                  </label>
                  <input
                    value={form.expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "");
                      if (v.length >= 2)
                        v = v.slice(0, 2) + "/" + v.slice(2, 4);
                      set({ expiry: v });
                    }}
                    className="h-11 w-full bg-neutral border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted/40 outline-none focus:border-primary/50 transition-colors font-mono"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
              </div>
            </>
          )}

          {/* Label / nickname */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
              {isCard ? "Nickname (optional)" : "Label"}
            </label>
            <input
              value={form.label}
              onChange={(e) => set({ label: e.target.value })}
              className="h-11 w-full bg-neutral border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted/40 outline-none focus:border-primary/50 transition-colors"
              placeholder={
                isCard
                  ? "e.g. Personal card"
                  : `e.g. My ${typeLabel(form.type)}`
              }
              maxLength={40}
              autoFocus={!isCard}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              disabled={!isValid || isSaving}
              className="flex-1 h-11 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── View all modal ────────────────────────────────────────────
function ViewAllModal({
  methods,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
  onClose,
  deletingId,
}: {
  methods: PaymentMethod[];
  onAdd: () => void;
  onEdit: (m: PaymentMethod) => void;
  onDelete: (id: Id<"paymentMethods">) => void;
  onSetDefault: (id: Id<"paymentMethods">) => void;
  onClose: () => void;
  deletingId: Id<"paymentMethods"> | null;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-sm flex flex-col shadow-xl max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <p className="text-sm font-black tracking-widest uppercase text-foreground">
            Payment Methods
          </p>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Add size={13} color="#fff" />
            Add New
          </button>
        </div>

        <div className="overflow-y-auto flex flex-col gap-1.5 p-4">
          {methods.length === 0 ? (
            <p className="text-sm text-muted text-center py-6">
              No payment methods added yet.
            </p>
          ) : (
            methods.map((m) => {
              return (
                <div
                  key={m._id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral group"
                >
                  <MethodIcon type={m.type} brand={m.brand} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {methodDisplayName(m)}
                    </p>
                    {m.type === "card" && m.expiry && (
                      <p className="text-[10px] text-muted uppercase tracking-widest">
                        Expires {m.expiry}
                      </p>
                    )}
                  </div>
                  {m.isDefault && (
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-primary/15 text-primary shrink-0">
                      Default
                    </span>
                  )}
                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    {!m.isDefault && (
                      <button
                        onClick={() => onSetDefault(m._id)}
                        title="Set as default"
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-border/50 transition-colors"
                      >
                        <Star1 size={13} color="var(--color-muted)" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(m)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-border/50 transition-colors"
                    >
                      <Edit2 size={13} color="var(--color-muted)" />
                    </button>
                    <button
                      onClick={() => onDelete(m._id)}
                      disabled={deletingId === m._id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-tertiary/10 transition-colors disabled:opacity-50"
                    >
                      <Trash size={13} color="var(--color-tertiary)" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main component ────────────────────────────────────────────
type EditTarget = PaymentMethod | null;

const EMPTY_FORM: FormValues = {
  type: "card",
  label: "",
  brand: "",
  last4: "",
  expiry: "",
};

export function PaymentMethodsSection() {
  const methods = useQuery(api.paymentMethods.getPaymentMethods);
  const createMethod = useMutation(api.paymentMethods.createPaymentMethod);
  const updateMethod = useMutation(api.paymentMethods.updatePaymentMethod);
  const deleteMethod = useMutation(api.paymentMethods.deletePaymentMethod);
  const setDefault = useMutation(api.paymentMethods.setDefaultPaymentMethod);

  const [viewAll, setViewAll] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<Id<"paymentMethods"> | null>(
    null
  );

  const preview = methods?.slice(0, 3) ?? [];

  const formInitial: FormValues = editTarget
    ? {
        type: editTarget.type,
        label: editTarget.label,
        brand: editTarget.brand ?? "",
        last4: editTarget.last4 ?? "",
        expiry: editTarget.expiry ?? "",
      }
    : EMPTY_FORM;

  function openAdd() {
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(m: EditTarget) {
    setEditTarget(m);
    setShowForm(true);
  }

  async function handleSave(values: FormValues) {
    setIsSaving(true);
    try {
      const payload = {
        type: values.type,
        label: values.label.trim(),
        brand:
          values.type === "card" && values.brand ? values.brand : undefined,
        last4:
          values.type === "card" && values.last4 ? values.last4 : undefined,
        expiry:
          values.type === "card" && values.expiry ? values.expiry : undefined,
      };

      if (editTarget) {
        await updateMethod({ id: editTarget._id, ...payload });
        toast.success("Payment method updated");
      } else {
        await createMethod(payload);
        toast.success("Payment method added");
      }
      setShowForm(false);
      setEditTarget(null);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: Id<"paymentMethods">) {
    setDeletingId(id);
    try {
      await deleteMethod({ id });
      toast.success("Payment method removed");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id: Id<"paymentMethods">) {
    try {
      await setDefault({ id });
      toast.success("Default updated");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardPos size={16} color="var(--color-primary)" variant="Bold" />
            <p className="text-xs font-bold tracking-widest uppercase text-foreground">
              Payment Methods
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-[10px] font-bold tracking-widest uppercase text-muted hover:text-foreground hover:border-border/80 transition-colors"
          >
            <Add size={13} color="currentColor" />
            Add New
          </button>
        </div>

        {/* Chips */}
        {methods === undefined ? (
          <div className="flex gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 h-28 rounded-2xl bg-neutral animate-pulse"
              />
            ))}
          </div>
        ) : methods.length === 0 ? (
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 h-24 rounded-2xl border border-dashed border-border text-sm font-semibold text-muted hover:text-foreground hover:border-border/80 transition-colors"
          >
            <Add size={16} color="currentColor" />
            Add your first payment method
          </button>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {preview.map((m) => (
              <MethodChip
                key={m._id}
                method={m}
                onEdit={() => openEdit(m)}
                onDelete={() => handleDelete(m._id)}
                onSetDefault={() => handleSetDefault(m._id)}
              />
            ))}
            {methods.length > 3 && (
              <button
                onClick={() => setViewAll(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-xs font-bold tracking-widest uppercase text-muted hover:text-foreground hover:border-border/80 transition-colors py-5"
              >
                +{methods.length - 3} more
              </button>
            )}
          </div>
        )}

        {methods && methods.length > 0 && (
          <button
            onClick={() => setViewAll(true)}
            className="self-start text-xs font-bold tracking-widest uppercase text-primary hover:opacity-80 transition-opacity"
          >
            View all {methods.length}
          </button>
        )}
      </div>

      {viewAll && methods && (
        <ViewAllModal
          methods={methods}
          onAdd={() => {
            setViewAll(false);
            openAdd();
          }}
          onEdit={(m) => {
            setViewAll(false);
            openEdit(m);
          }}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
          onClose={() => setViewAll(false)}
          deletingId={deletingId}
        />
      )}

      {showForm && (
        <PaymentMethodModal
          initial={formInitial}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
