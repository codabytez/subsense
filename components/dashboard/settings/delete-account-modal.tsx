"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Warning2 } from "iconsax-reactjs";
import { toast } from "sonner";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const deleteAccount = useAction(api.users.deleteAccount);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await signOut();
      router.push("/login");
    } catch {
      toast.error("Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
              {/* Icon + heading */}
              <div className="flex flex-col items-center gap-4 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(249,112,102,0.12)" }}
                >
                  <Warning2
                    size={28}
                    color="var(--color-tertiary)"
                    variant="Bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-black text-foreground">
                    Terminate account?
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    This will permanently delete your account, all your
                    subscriptions, and every piece of data tied to it.{" "}
                    <span className="text-foreground font-semibold">
                      This cannot be undone.
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  className="w-full h-12 text-sm font-bold"
                  style={{
                    backgroundColor: "var(--color-tertiary)",
                  }}
                  onClick={handleConfirm}
                  isLoading={isDeleting}
                  disabled={isDeleting}
                >
                  Yes, delete my account
                </Button>
                <Button
                  variant="outlined"
                  className="w-full h-12 text-sm font-semibold"
                  onClick={onClose}
                  disabled={isDeleting}
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
