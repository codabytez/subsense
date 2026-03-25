"use client";

import { motion } from "framer-motion";
import { ExportSquare } from "iconsax-reactjs";

interface LinkedAccountProps {
  email: string;
  label: string;
  iconInitial: string;
  iconBg: string;
}

export function LinkedAccount({
  email,
  label,
  iconInitial,
  iconBg,
}: LinkedAccountProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-foreground">Linked Account</h2>

      <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-foreground shrink-0 ${iconBg}`}
        >
          {iconInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {email}
          </p>
          <p className="text-xs text-muted mt-0.5">{label}</p>
        </div>
        <button className="text-muted hover:text-foreground transition-colors">
          <ExportSquare size={18} color="currentColor" />
        </button>
      </div>
    </motion.div>
  );
}
