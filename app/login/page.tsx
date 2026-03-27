"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/auth-client";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = isSubmitting || isGoogleLoading;

  async function onSubmit(values: LoginFormValues) {
    const result = await signIn.email({
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      toast.error(result.error.message ?? "Sign in failed. Please try again.");
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: "/dashboard" });
    } catch {
      toast.error("Google sign in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left brand panel (desktop only) ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="login-brand-panel hidden lg:flex flex-col justify-between w-120 shrink-0 border-r border-border px-12 py-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/white_logo_mark.svg"
            alt="Subsense"
            width={29}
            height={27}
            className="login-logo-dark"
            style={{ width: 28, height: "auto" }}
          />
          <Image
            src="/dark_logo_mark.svg"
            alt="Subsense"
            width={76}
            height={72}
            className="login-logo-light"
            style={{ width: 28, height: "auto" }}
          />
          <span className="text-sm font-bold tracking-widest uppercase text-primary font-display">
            Subsense
          </span>
        </div>

        {/* Tagline */}
        <div className="flex flex-col gap-4">
          <h1 className="login-brand-heading text-4xl font-black leading-tight font-display">
            Every subscription,
            <br />
            <span className="text-primary">perfectly tracked.</span>
          </h1>
          <p className="login-brand-copy text-sm leading-relaxed max-w-xs">
            One dashboard for all your recurring costs. No more surprise
            charges, no more forgotten trials.
          </p>

          {/* Stat pills */}
          <div className="flex gap-3 mt-2">
            {[
              { value: "$2.4k", label: "avg. saved/yr" },
              { value: "94%", label: "renewal accuracy" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="login-brand-pill flex flex-col gap-0.5 px-4 py-3 rounded-xl border"
              >
                <span className="login-brand-heading text-lg font-black font-mono">
                  {value}
                </span>
                <span className="login-brand-copy text-[10px] font-semibold uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="login-brand-footer text-[11px]">
          © {new Date().getFullYear()} Subsense. All rights reserved.
        </p>
      </motion.div>

      {/* ── Right form panel ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-100 flex flex-col gap-8"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <Image
              src="/white_logo_mark.svg"
              alt="Subsense"
              width={29}
              height={27}
              style={{ width: 24, height: "auto" }}
            />
            <span className="text-sm font-bold tracking-widest uppercase text-primary font-display">
              Subsense
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted">Sign in to continue</p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                Email
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
                aria-invalid={Boolean(errors.email)}
                className={cn(
                  errors.email && "border-tertiary/60 focus:border-tertiary/60"
                )}
              />
              {errors.email && (
                <p className="text-[11px] text-tertiary">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
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
                  disabled={isLoading}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors",
                    isLoading && "opacity-50 pointer-events-none"
                  )}
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

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-sm font-bold mt-1"
              disabled={!isValid || isLoading}
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted font-semibold uppercase tracking-widest">
              or
            </span>
            <span className="flex-1 h-px bg-border" />
          </div>

          {/* OAuth */}
          <Button
            variant="outlined"
            className="w-full h-12 text-sm font-semibold gap-3"
            disabled={isLoading}
            isLoading={isGoogleLoading}
            onClick={handleGoogleSignIn}
          >
            {!isGoogleLoading && (
              <Image src="/google.svg" alt="Google" width={18} height={18} />
            )}
            Continue with Google
          </Button>

          {/* Sign up */}
          <p className="text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
