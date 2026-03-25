"use client";

import { motion } from "framer-motion";
import {
  Edit2,
  Pause,
  CloseCircle,
  ExportSquare,
  TickCircle,
} from "iconsax-reactjs";

interface SubscriptionHeroProps {
  name: string;
  status: SubscriptionStatus;
  plan?: string;
  iconInitial: string;
  iconBg: string;
  gradientColor: string;
  onConfirmPayment?: () => void;
  onEdit?: () => void;
}

export function SubscriptionHero({
  name,
  status,
  plan,
  iconInitial,
  iconBg,
  gradientColor,
  onConfirmPayment,
  onEdit,
}: SubscriptionHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${gradientColor}55 0%, #0e0e13 70%)`,
      }}
    >
      {/* Blurred glow behind icon */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: gradientColor }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4 py-10 px-6">
        {/* App icon */}
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl ${iconBg}`}
        >
          {iconInitial}
        </div>

        {/* Name */}
        <h1 className="text-4xl font-black text-foreground text-center">
          {name}
        </h1>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            {status}
          </span>
          {plan && (
            <span className="px-3 py-1 rounded-full border border-border text-muted text-[10px] font-bold tracking-widest uppercase">
              {plan}
            </span>
          )}
        </div>

        {/* Actions — right aligned */}
        <div className="flex items-center gap-2 mt-1 self-end">
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
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-white/5 transition-colors">
            <Pause size={15} color="currentColor" />
            Pause
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-tertiary rounded-xl text-sm font-semibold text-tertiary hover:bg-tertiary/5 transition-colors">
            <CloseCircle size={15} color="currentColor" />
            Cancel
          </button>
          <button className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-muted hover:text-foreground transition-colors">
            <ExportSquare size={16} color="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
