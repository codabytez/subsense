"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import {
  Edit2,
  Trash,
  CardPos,
  Star1,
  Add,
  Bank,
  Paypal,
  Wallet,
  Card,
} from "iconsax-reactjs";

import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

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

// ── Brand / type icon component ────────────────────────────────
function VisaSvg() {
  return (
    <svg viewBox="0 0 48 16" width="36" height="12" aria-label="Visa">
      <text
        x="0"
        y="13"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="16"
        fill="#1A1F71"
        letterSpacing="-0.5"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardSvg() {
  return (
    <svg viewBox="0 0 38 24" width="38" height="24" aria-label="Mastercard">
      <circle cx="14" cy="12" r="12" fill="#EB001B" />
      <circle cx="24" cy="12" r="12" fill="#F79E1B" />
      <path d="M19 5.3a12 12 0 0 1 0 13.4A12 12 0 0 1 19 5.3z" fill="#FF5F00" />
    </svg>
  );
}

function AmexSvg() {
  return (
    <svg viewBox="0 0 48 16" width="36" height="12" aria-label="Amex">
      <text
        x="0"
        y="13"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="13"
        fill="#ffffff"
        letterSpacing="0.5"
      >
        AMEX
      </text>
    </svg>
  );
}

function DiscoverSvg() {
  return (
    <svg viewBox="0 0 60 16" width="44" height="12" aria-label="Discover">
      <text
        x="0"
        y="13"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="12"
        fill="#ffffff"
        letterSpacing="0.3"
      >
        DISCOVER
      </text>
    </svg>
  );
}

function VerveSvg() {
  return (
    <svg viewBox="0 0 44 16" width="38" height="12" aria-label="Verve">
      <text
        x="0"
        y="13"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="13"
        fill="#ffffff"
        letterSpacing="0.5"
      >
        verve
      </text>
    </svg>
  );
}

function AppleSvg() {
  // Apple logo path
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-label="Apple Pay">
      <path
        fill="#ffffff"
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      />
    </svg>
  );
}

function GooglePaySvg() {
  return (
    <svg viewBox="0 0 41 17" width="41" height="17" aria-label="Google Pay">
      <text
        x="0"
        y="13"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="#4285F4"
      >
        G
      </text>
      <text
        x="10"
        y="13"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="#34A853"
      >
        o
      </text>
      <text
        x="18"
        y="13"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="#FBBC05"
      >
        o
      </text>
      <text
        x="26"
        y="13"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="#EA4335"
      >
        g
      </text>
    </svg>
  );
}

type MethodIconProps = {
  type: PaymentType;
  brand?: string;
  size?: "md" | "sm";
};

function MethodIcon({ type, brand, size = "md" }: MethodIconProps) {
  const dim = size === "md" ? "w-11 h-11" : "w-8 h-8";
  const radius = size === "md" ? "rounded-xl" : "rounded-lg";

  if (type === "card") {
    if (brand === "Visa") {
      return (
        <div
          className={`${dim} ${radius} bg-white flex items-center justify-center shrink-0`}
        >
          <VisaSvg />
        </div>
      );
    }
    if (brand === "Mastercard") {
      return (
        <div
          className={`${dim} ${radius} bg-white flex items-center justify-center shrink-0`}
        >
          <MastercardSvg />
        </div>
      );
    }
    if (brand === "Amex") {
      return (
        <div
          className={`${dim} ${radius} flex items-center justify-center shrink-0`}
          style={{ backgroundColor: "#007BC1" }}
        >
          <AmexSvg />
        </div>
      );
    }
    if (brand === "Discover") {
      return (
        <div
          className={`${dim} ${radius} flex items-center justify-center shrink-0`}
          style={{ backgroundColor: "#FF6600" }}
        >
          <DiscoverSvg />
        </div>
      );
    }
    if (brand === "Verve") {
      return (
        <div
          className={`${dim} ${radius} flex items-center justify-center shrink-0`}
          style={{ backgroundColor: "#00A86B" }}
        >
          <VerveSvg />
        </div>
      );
    }
    // Generic card
    return (
      <div
        className={`${dim} ${radius} flex items-center justify-center shrink-0`}
        style={{ backgroundColor: "#6366F1" }}
      >
        <Card size={size === "md" ? 20 : 16} color="#fff" />
      </div>
    );
  }

  if (type === "paypal") {
    return (
      <div
        className={`${dim} ${radius} flex items-center justify-center shrink-0`}
        style={{ backgroundColor: "#003087" }}
      >
        <Paypal size={size === "md" ? 20 : 16} color="#fff" />
      </div>
    );
  }

  if (type === "apple_pay") {
    return (
      <div
        className={`${dim} ${radius} flex items-center justify-center shrink-0`}
        style={{ backgroundColor: "#1C1C1E" }}
      >
        <AppleSvg />
      </div>
    );
  }

  if (type === "google_pay") {
    return (
      <div
        className={`${dim} ${radius} bg-white flex items-center justify-center shrink-0`}
      >
        <GooglePaySvg />
      </div>
    );
  }

  if (type === "bank") {
    return (
      <div
        className={`${dim} ${radius} flex items-center justify-center shrink-0`}
        style={{ backgroundColor: "#22C55E" }}
      >
        <Bank size={size === "md" ? 20 : 16} color="#fff" />
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
    <div className="bg-neutral rounded-2xl p-5 flex flex-col gap-4 group relative">
      <div className="flex items-start justify-between">
        <MethodIcon type={method.type} brand={method.brand} size="md" />
        {method.isDefault && (
          <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded bg-primary/15 text-primary">
            Default
          </span>
        )}
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

      {/* Actions — always visible on mobile, hover-only on desktop */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface border border-border rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5 shadow-xl">
        <h3 className="text-base font-black text-foreground">
          {initial.label || initial.brand
            ? "Edit payment method"
            : "New payment method"}
        </h3>

        {/* Type selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
            Type
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => set({ type: value })}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                  form.type === value
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border text-muted hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Card-specific fields */}
        {isCard && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                Brand
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CARD_BRANDS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set({ brand: b })}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                      form.brand === b
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border text-muted hover:text-foreground"
                    )}
                  >
                    {b}
                  </button>
                ))}
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
                    if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
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
              isCard ? "e.g. Personal card" : `e.g. My ${typeLabel(form.type)}`
            }
            maxLength={40}
            autoFocus={!isCard}
          />
        </div>

        <div className="flex gap-2 pt-1">
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
  return (
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
    </div>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
