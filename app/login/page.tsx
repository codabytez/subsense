"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeSlash } from "iconsax-reactjs";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary/50 transition-colors";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            width={28}
            height={28}
            className="login-logo-dark"
            style={{ width: 28, height: "auto" }}
          />
          <Image
            src="/dark_logo_mark.svg"
            alt="Subsense"
            width={28}
            height={28}
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
              width={24}
              height={24}
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
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted">
                Email
              </label>
              <input
                className={inputCls}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
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
                <input
                  className={cn(inputCls, "pr-11")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeSlash size={18} color="currentColor" />
                  ) : (
                    <Eye size={18} color="currentColor" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-sm font-bold mt-1"
              disabled={!email || !password}
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
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                fill="#EA4335"
              />
            </svg>
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
