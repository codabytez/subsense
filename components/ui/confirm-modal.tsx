"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Warning2 } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "danger" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  confirmVariant = "primary",
  isLoading,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const confirmStyle =
    confirmVariant === "danger"
      ? { backgroundColor: "var(--color-tertiary)" }
      : { backgroundColor: "var(--color-primary)" };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => !isLoading && onClose()}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
              <div className="flex flex-col items-center gap-4 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      confirmVariant === "danger"
                        ? "rgba(249,112,102,0.12)"
                        : "rgba(124,92,252,0.12)",
                  }}
                >
                  <Warning2
                    size={28}
                    color={
                      confirmVariant === "danger"
                        ? "var(--color-tertiary)"
                        : "var(--color-primary)"
                    }
                    variant="Bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-black text-foreground">
                    {title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  className="w-full h-12 text-sm font-bold"
                  style={confirmStyle}
                  isLoading={isLoading}
                  disabled={isLoading}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
                <Button
                  variant="outlined"
                  className="w-full h-12 text-sm font-semibold"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
