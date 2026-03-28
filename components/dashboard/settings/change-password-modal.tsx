"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CloseSquare, Eye, EyeSlash, TickCircle } from "iconsax-reactjs";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [serverError, setServerError] = useState("");
  const [changed, setChanged] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setServerError("");
    const result = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: false,
    });
    if (result.error) {
      setServerError(result.error.message ?? "Incorrect current password.");
      return;
    }
    reset();
    setChanged(true);
    setTimeout(() => {
      setChanged(false);
      onClose();
    }, 2000);
  }

  function handleClose() {
    if (isSubmitting) return;
    reset();
    setServerError("");
    setChanged(false);
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    onClose();
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div
              className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Change Password
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Enter your current password to set a new one.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <CloseSquare size={20} color="currentColor" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                    Current Password
                  </p>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      disabled={isSubmitting}
                      placeholder="••••••••"
                      className="w-full bg-neutral rounded-xl px-4 py-3 pr-11 text-sm font-semibold text-foreground placeholder:text-muted/50 outline-none focus:ring-1 focus:ring-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      {...register("currentPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showCurrent ? (
                        <EyeSlash size={16} color="currentColor" />
                      ) : (
                        <Eye size={16} color="currentColor" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-xs text-tertiary mt-1.5">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                    New Password
                  </p>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      disabled={isSubmitting}
                      placeholder="••••••••"
                      className="w-full bg-neutral rounded-xl px-4 py-3 pr-11 text-sm font-semibold text-foreground placeholder:text-muted/50 outline-none focus:ring-1 focus:ring-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      {...register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showNew ? (
                        <EyeSlash size={16} color="currentColor" />
                      ) : (
                        <Eye size={16} color="currentColor" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-tertiary mt-1.5">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                    Confirm New Password
                  </p>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      disabled={isSubmitting}
                      placeholder="••••••••"
                      className="w-full bg-neutral rounded-xl px-4 py-3 pr-11 text-sm font-semibold text-foreground placeholder:text-muted/50 outline-none focus:ring-1 focus:ring-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <EyeSlash size={16} color="currentColor" />
                      ) : (
                        <Eye size={16} color="currentColor" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-tertiary mt-1.5">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <p className="text-xs text-tertiary">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || changed}
                  className="w-full py-3.5 rounded-xl text-sm font-black text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {changed ? (
                    <>
                      <TickCircle
                        size={15}
                        color="currentColor"
                        variant="Bold"
                      />
                      Password Updated
                    </>
                  ) : isSubmitting ? (
                    "Updating…"
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
