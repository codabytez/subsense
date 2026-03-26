"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogoutCurve } from "iconsax-reactjs";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui";

interface SignOutModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignOutModal({ open, onClose }: SignOutModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/login");
    } catch {
      toast.error("Failed to sign out. Please try again.");
      setIsLoading(false);
    }
  }

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
            onClick={onClose}
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
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <LogoutCurve
                    size={26}
                    color="var(--color-primary)"
                    variant="Bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-black text-foreground">
                    Sign out?
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    You&apos;ll need to sign back in to access your dashboard.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  className="w-full h-12 text-sm font-bold"
                  onClick={handleConfirm}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Sign out
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
