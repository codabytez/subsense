"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeSlash, TickCircle } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Invalid or expired reset link. Please request a new one.");
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      toast.error(error.message ?? "Something went wrong. Please try again.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  // No token in URL
  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-100 flex flex-col gap-6 text-center">
          <p className="text-muted text-sm">
            This reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="text-primary font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            Request a new link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-100 flex flex-col gap-8"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/white_logo_mark.svg"
            alt="Subsense"
            width={24}
            height={24}
            className="login-logo-dark"
            style={{ width: 24, height: "auto" }}
          />
          <Image
            src="/dark_logo_mark.svg"
            alt="Subsense"
            width={24}
            height={24}
            className="login-logo-light"
            style={{ width: 24, height: "auto" }}
          />
          <span className="text-sm font-bold tracking-widest uppercase text-primary font-display">
            Subsense
          </span>
        </div>

        {!done ? (
          <>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-foreground">
                Set new password
              </h2>
              <p className="text-sm text-muted">
                Choose a strong password for your account.
              </p>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* New password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                  New password
                </label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    className={cn(
                      "pr-11",
                      errors.password &&
                        "border-tertiary/60 focus:border-tertiary/60"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeSlash size={18} color="currentColor" />
                    ) : (
                      <Eye size={18} color="currentColor" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-tertiary">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                  Confirm password
                </label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    className={cn(
                      "pr-11",
                      errors.confirmPassword &&
                        "border-tertiary/60 focus:border-tertiary/60"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showConfirm ? (
                      <EyeSlash size={18} color="currentColor" />
                    ) : (
                      <Eye size={18} color="currentColor" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-tertiary">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-sm font-bold mt-1"
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
              >
                Reset Password
              </Button>
            </form>
          </>
        ) : (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TickCircle size={24} color="currentColor" variant="Bold" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-foreground">
                Password updated
              </h2>
              <p className="text-sm text-muted">
                You&apos;re all set. Redirecting you to sign in…
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-100 flex flex-col gap-8 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-muted/30" />
          <div className="h-4 w-24 rounded bg-muted/30" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-8 w-48 rounded bg-muted/30" />
          <div className="h-4 w-64 rounded bg-muted/20" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-12 w-full rounded-2xl bg-muted/20" />
          <div className="h-12 w-full rounded-2xl bg-muted/20" />
          <div className="h-12 w-full rounded-2xl bg-muted/30" />
        </div>
      </div>
    </div>
  );
}
