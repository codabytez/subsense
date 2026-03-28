"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, Trash, Bell, Globe } from "lucide-react";

const LAST_UPDATED = "March 28, 2026";

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: [
      {
        heading: "Account Information",
        body: "When you create an account, we collect your name, email address, and a hashed password. If you sign in with Google, we receive your name, email, and profile photo from Google — we never see your Google password.",
      },
      {
        heading: "Subscription Data",
        body: "All subscription entries you create — names, amounts, billing cycles, renewal dates, categories, and notes — are stored and associated with your account so we can provide the tracking and insights you signed up for.",
      },
      {
        heading: "Usage & Analytics",
        body: "We collect anonymous, aggregated usage signals (page views, feature interactions) to understand how Subsense is used and to improve the product. This data cannot be linked back to you individually.",
      },
    ],
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content: [
      {
        heading: "To Power the Product",
        body: "Your data is used exclusively to provide Subsense's core functionality: tracking subscriptions, calculating spend, sending renewal reminders, and generating insights on your spending patterns.",
      },
      {
        heading: "To Send You Notifications",
        body: "With your explicit permission, we send email digests, renewal reminders, and price change alerts. You can adjust or disable these at any time in your notification settings.",
      },
      {
        heading: "To Improve Subsense",
        body: "Anonymised, aggregated data helps us understand which features are most useful and where we should invest in improvements. We never sell your personal data or use it for third-party advertising.",
      },
    ],
  },
  {
    icon: Globe,
    title: "Data Sharing & Third Parties",
    content: [
      {
        heading: "Infrastructure Partners",
        body: "We use Convex for our database and real-time backend, and Resend for transactional email delivery. Both are processed under strict data processing agreements and are used solely to operate Subsense.",
      },
      {
        heading: "Google OAuth",
        body: "If you choose to sign in with Google, authentication is handled by Google's OAuth 2.0 service. We only receive the basic profile scopes (name, email, profile picture). We do not receive access to your Google account, Gmail, Drive, or any other Google service.",
      },
      {
        heading: "No Data Sales",
        body: "We do not sell, rent, or trade your personal information to any third party under any circumstances.",
      },
    ],
  },
  {
    icon: Bell,
    title: "Cookies & Local Storage",
    content: [
      {
        heading: "Session Cookies",
        body: "We use a single session cookie to keep you logged in. This cookie is HttpOnly, Secure, and expires when your session ends or after 30 days of inactivity.",
      },
      {
        heading: "Preferences",
        body: "Your theme preference (light/dark) is stored in local storage on your device. This data never leaves your browser.",
      },
      {
        heading: "No Tracking Cookies",
        body: "We do not use any third-party advertising, analytics, or tracking cookies. There are no pixel trackers or fingerprinting scripts on Subsense.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Data Security",
    content: [
      {
        heading: "Encryption",
        body: "All data is encrypted in transit via TLS 1.2+ and at rest using AES-256. Passwords are hashed using bcrypt and are never stored in plain text.",
      },
      {
        heading: "Access Controls",
        body: "Your subscription data is strictly scoped to your account. No other user can query, view, or modify your data. Our team accesses production data only when required for support, and only with your consent.",
      },
      {
        heading: "Incident Response",
        body: "In the unlikely event of a data breach affecting your personal information, we will notify you within 72 hours via the email on your account.",
      },
    ],
  },
  {
    icon: Trash,
    title: "Your Rights & Data Deletion",
    content: [
      {
        heading: "Access & Export",
        body: "You have the right to know what data we hold about you. Contact us at privacy@subsense.app and we will provide a full export of your account data within 7 days.",
      },
      {
        heading: "Account Deletion",
        body: "You can permanently delete your account at any time from Settings → Account. Deletion is immediate and irreversible — all your subscriptions, payment logs, categories, notifications, and personal information are permanently erased from our systems within 30 days.",
      },
      {
        heading: "GDPR & CCPA",
        body: "If you are located in the European Economic Area or California, you have additional rights under GDPR and CCPA respectively, including the right to data portability and the right to object to processing. To exercise any of these rights, contact us at hello@unbuilt.studio.",
      },
    ],
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const, delay: i * 0.07 },
  }),
};

export function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/white_logo_mark.svg"
              alt="Subsense"
              width={22}
              height={22}
              style={{ width: 22, height: "auto" }}
              className="block dark:block"
            />
            <span className="text-sm font-bold tracking-widest uppercase text-primary font-display">
              Subsense
            </span>
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 60% 0%, rgba(124,92,252,0.1) 0%, transparent 65%)",
          }}
        />
        <div className="max-w-5xl mx-auto px-6 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-5 max-w-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-widest uppercase">
                <Shield size={11} />
                Privacy Policy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-display leading-tight">
              Your data, <span className="text-primary">your rules.</span>
            </h1>
            <p className="text-base text-muted leading-relaxed max-w-xl">
              We built Subsense to help you understand your finances — not to
              monetise your personal information. Here&apos;s exactly what we
              collect, why, and how it&apos;s protected.
            </p>
            <p className="text-xs text-muted/60 font-mono">
              Last updated: {LAST_UPDATED}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-12">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-col gap-6"
            >
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <h2 className="text-xl font-black font-display">
                  {section.title}
                </h2>
              </div>

              {/* Sub-items */}
              <div className="grid md:grid-cols-1 gap-4 pl-12">
                {section.content.map((item) => (
                  <div
                    key={item.heading}
                    className="flex flex-col gap-1.5 p-5 rounded-2xl bg-surface border border-border"
                  >
                    <h3 className="text-sm font-bold text-foreground">
                      {item.heading}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Contact */}
        <motion.div
          custom={sections.length}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col gap-3"
        >
          <h2 className="text-lg font-black font-display">Questions?</h2>
          <p className="text-sm text-muted leading-relaxed">
            If you have any questions about this Privacy Policy or how we handle
            your data, reach out to us at{" "}
            <a
              href="mailto:hello@unbuilt.studio"
              className="text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              hello@unbuilt.studio
            </a>
            . We typically respond within 1–2 business days.
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} Subsense. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-xs text-muted hover:text-foreground transition-colors font-semibold"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-primary font-semibold"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
