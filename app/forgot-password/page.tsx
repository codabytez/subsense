"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Sms } from "iconsax-reactjs";
import { Button, Input } from "@/components/ui";
import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSent(true);
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

        {!sent ? (
          <>
            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-foreground">
                Forgot password?
              </h2>
              <p className="text-sm text-muted">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {/* Form */}
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                  Email
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.email)}
                  className={
                    errors.email
                      ? "border-tertiary/60 focus:border-tertiary/60"
                      : undefined
                  }
                />
                {errors.email && (
                  <p className="text-[11px] text-tertiary">
                    {errors.email.message}
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
                Send Reset Link
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
              <Sms size={24} color="currentColor" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-foreground">
                Check your inbox
              </h2>
              <p className="text-sm text-muted">
                If{" "}
                <span className="text-foreground font-medium">
                  {getValues("email")}
                </span>{" "}
                is registered, you&apos;ll receive a reset link shortly. It
                expires in 1 hour.
              </p>
            </div>
            <Button
              variant="outlined"
              className="w-full h-12 text-sm font-semibold mt-2"
              onClick={() => router.push("/login")}
            >
              Back to sign in
            </Button>
          </motion.div>
        )}

        {/* Back link */}
        {!sent && (
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft size={14} color="currentColor" />
            Back to sign in
          </Link>
        )}
      </motion.div>
    </div>
  );
}
