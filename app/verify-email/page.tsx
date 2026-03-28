"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sms, ArrowLeft2, Refresh } from "iconsax-reactjs";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

const COOLDOWN = 60;

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function handleResend() {
    if (!email || countdown > 0) return;
    setIsResending(true);

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: `${window.location.origin}/onboarding`,
    });

    setIsResending(false);

    if (error) {
      toast.error(error.message ?? "Could not resend. Please try again.");
      return;
    }

    toast.success("Verification email sent!");
    setCountdown(COOLDOWN);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm flex flex-col items-center gap-8 text-center"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/white_logo_mark.svg"
            alt="Subsense"
            width={29}
            height={27}
            style={{ width: 22, height: "auto" }}
          />
          <span className="text-sm font-bold tracking-widest uppercase text-primary font-display">
            Subsense
          </span>
        </div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center"
        >
          <Sms size={36} color="var(--color-primary)" variant="Bold" />
        </motion.div>

        {/* Copy */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-foreground">
            Check your email
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            We sent a verification link to{" "}
            <span className="text-foreground font-semibold">
              {email || "your inbox"}
            </span>
            . Click the link to activate your account.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            className="w-full h-12 text-sm font-bold"
            onClick={handleResend}
            disabled={countdown > 0 || isResending || !email}
            isLoading={isResending}
          >
            {countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <Refresh size={16} color="currentColor" />
                Resend verification email
              </>
            )}
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft2 size={14} color="currentColor" />
            Back to sign in
          </Link>
        </div>

        {/* Help */}
        <p className="text-[11px] text-muted leading-relaxed max-w-xs">
          Didn&apos;t receive it? Check your spam folder. The link expires in 24
          hours.
        </p>
      </motion.div>
    </div>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-muted/30" />
          <div className="h-4 w-24 rounded bg-muted/30" />
        </div>
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20" />
        <div className="flex w-full flex-col items-center gap-2">
          <div className="h-8 w-40 rounded bg-muted/30" />
          <div className="h-4 w-64 rounded bg-muted/20" />
          <div className="h-4 w-48 rounded bg-muted/20" />
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="h-12 w-full rounded-2xl bg-muted/20" />
          <div className="h-5 w-28 self-center rounded bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
