"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Warning2, Eye, EyeSlash } from "iconsax-reactjs";
import { toast } from "sonner";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const CONFIRM_WORD = "DELETE";

export function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const deleteAccount = useAction(api.users.deleteAccount);

  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  function handleClose() {
    if (isDeleting) return;
    setStep(1);
    setConfirmText("");
    setPassword("");
    setPasswordError("");
    onClose();
  }

  async function handleDelete() {
    if (!user?.email) return;
    setIsDeleting(true);
    setPasswordError("");
    try {
      const result = await authClient.signIn.email({
        email: user.email,
        password,
      });
      if (result.error) {
        setPasswordError("Incorrect password. Please try again.");
        setIsDeleting(false);
        return;
      }
    } catch {
      setPasswordError("Incorrect password. Please try again.");
      setIsDeleting(false);
      return;
    }
    try {
      await deleteAccount();
      await signOut();
      toast.error("Your account has been deleted.", {
        description: "We're sorry to see you go.",
      });
      router.push("/login");
    } catch {
      setPasswordError("Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  }

  const inputCls =
    "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors";

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
            onClick={handleClose}
          />

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

              {/* Step indicators */}
              <div className="flex items-center gap-2">
                {([1, 2] as const).map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-300",
                      step >= s ? "bg-tertiary" : "bg-border"
                    )}
                  />
                ))}
              </div>

              {/* Step 1 — type DELETE */}
              {step === 1 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted">
                    Type{" "}
                    <span className="font-black text-tertiary tracking-widest">
                      {CONFIRM_WORD}
                    </span>{" "}
                    to continue
                  </p>
                  <input
                    className={inputCls}
                    placeholder={CONFIRM_WORD}
                    value={confirmText}
                    onChange={(e) =>
                      setConfirmText(e.target.value.toUpperCase())
                    }
                    autoFocus
                  />
                  <Button
                    variant="primary"
                    className="w-full h-12 text-sm font-bold"
                    style={{ backgroundColor: "var(--color-tertiary)" }}
                    disabled={confirmText !== CONFIRM_WORD}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outlined"
                    className="w-full h-12 text-sm font-semibold"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {/* Step 2 — enter password */}
              {step === 2 && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted">
                    Enter your password to confirm
                  </p>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={cn(
                        inputCls,
                        "pr-11",
                        passwordError && "border-tertiary/60"
                      )}
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlash size={16} color="currentColor" />
                      ) : (
                        <Eye size={16} color="currentColor" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-tertiary">{passwordError}</p>
                  )}
                  <Button
                    variant="primary"
                    className="w-full h-12 text-sm font-bold"
                    style={{ backgroundColor: "var(--color-tertiary)" }}
                    disabled={!password || isDeleting}
                    isLoading={isDeleting}
                    onClick={handleDelete}
                  >
                    Delete my account
                  </Button>
                  <Button
                    variant="outlined"
                    className="w-full h-12 text-sm font-semibold"
                    onClick={() => setStep(1)}
                    disabled={isDeleting}
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
