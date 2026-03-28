"use client";

import { motion } from "framer-motion";
import { Edit2, Pause, Play, CloseCircle, TickCircle } from "iconsax-reactjs";

/** Extract "r,g,b" from "rgba(r,g,b,a)" or return a fallback */
function rgbFromRgba(rgba: string): string {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? `${m[1]},${m[2]},${m[3]}` : "124,92,252";
}

interface SubscriptionHeroProps {
  name: string;
  status: SubscriptionStatus;
  plan?: string;
  iconInitial: string;
  iconColor: string;
  onConfirmPayment?: () => void;
  onEdit?: () => void;
  onTogglePause?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isUpdatingStatus?: boolean;
}

export function SubscriptionHero({
  name,
  status,
  plan,
  iconInitial,
  iconColor,
  onConfirmPayment,
  onEdit,
  onTogglePause,
  onCancel,
  onDelete,
  isUpdatingStatus,
}: SubscriptionHeroProps) {
  const statusConfig: Record<
    SubscriptionStatus,
    { label: string; color: string }
  > = {
    active: { label: "Active", color: "var(--color-secondary)" },
    trial: { label: "Trial", color: "var(--color-tertiary)" },
    paused: { label: "Paused", color: "var(--color-muted)" },
    cancelled: { label: "Cancelled", color: "var(--color-tertiary)" },
  };

  const { label: statusLabel, color: statusColor } = statusConfig[status];
  const rgb = rgbFromRgba(iconColor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, rgba(${rgb},0.35) 0%, #0e0e13 70%)`,
      }}
    >
      {/* Blurred glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: `rgb(${rgb})` }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4 py-10 px-6">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl"
          style={{ backgroundColor: iconColor }}
        >
          {iconInitial}
        </div>

        {/* Name */}
        <h1 className="text-4xl font-black text-foreground text-center">
          {name}
        </h1>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
            style={{
              backgroundColor: `${statusColor}20`,
              color: statusColor,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            {statusLabel}
          </span>
          {plan && (
            <span className="px-3 py-1 rounded-full border border-border text-muted text-[10px] font-bold tracking-widest uppercase">
              {plan}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-1 flex-wrap justify-end self-end">
          {onConfirmPayment && (
            <button
              onClick={onConfirmPayment}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <TickCircle size={15} color="currentColor" />
              Confirm Payment
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
          >
            <Edit2 size={15} color="currentColor" />
            Edit
          </button>
          {onTogglePause && (
            <button
              onClick={onTogglePause}
              disabled={isUpdatingStatus}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              {status === "paused" ? (
                <>
                  <Play size={15} color="currentColor" />
                  Resume
                </>
              ) : (
                <>
                  <Pause size={15} color="currentColor" />
                  Pause
                </>
              )}
            </button>
          )}
          {onCancel && status !== "cancelled" && (
            <button
              onClick={onCancel}
              disabled={isUpdatingStatus}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-tertiary rounded-xl text-sm font-semibold text-tertiary hover:bg-tertiary/5 transition-colors disabled:opacity-40"
            >
              <CloseCircle size={15} color="currentColor" />
              Cancel
            </button>
          )}
          {status === "cancelled" && onDelete && (
            <button
              onClick={onDelete}
              disabled={isUpdatingStatus}
              className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-tertiary rounded-xl text-sm font-semibold text-tertiary hover:bg-tertiary/5 transition-colors disabled:opacity-40"
            >
              <CloseCircle size={15} color="currentColor" />
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
