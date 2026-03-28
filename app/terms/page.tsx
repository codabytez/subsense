"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Users,
  CreditCard,
  AlertTriangle,
  Scale,
  RefreshCw,
  Ban,
} from "lucide-react";

const LAST_UPDATED = "March 28, 2026";

const sections = [
  {
    icon: Users,
    title: "Who Can Use Subsense",
    content: [
      {
        heading: "Eligibility",
        body: "Subsense is available to anyone aged 16 or older. By creating an account, you confirm that you meet this requirement and that the information you provide is accurate and current.",
      },
      {
        heading: "Account Responsibility",
        body: "Your account is personal to you. You are responsible for keeping your login credentials secure and for all activity that occurs under your account. If you suspect unauthorised access, change your password immediately and contact us.",
      },
      {
        heading: "One Account Per Person",
        body: "Each person may maintain one Subsense account. Creating duplicate accounts to circumvent usage limits or any other restriction is not permitted.",
      },
    ],
  },
  {
    icon: FileText,
    title: "What Subsense Is (and Isn't)",
    content: [
      {
        heading: "A Tracking Tool, Not Financial Advice",
        body: "Subsense is a personal finance tracking tool. The insights, summaries, and spend projections we display are informational only and do not constitute financial, legal, or tax advice. Always consult a qualified professional for advice specific to your situation.",
      },
      {
        heading: "No Connection to Your Subscriptions",
        body: "Subsense does not connect to, control, or manage your subscriptions with third-party services. We do not cancel subscriptions on your behalf, process payments, or interact with any external service. All data is entered and managed by you.",
      },
      {
        heading: "Data Accuracy",
        body: "The accuracy of insights and projections in Subsense depends entirely on the data you enter. We are not responsible for decisions made based on incorrect or incomplete subscription data.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    content: [
      {
        heading: "Free Access",
        body: "Subsense is currently provided free of charge. If we introduce paid plans in the future, existing users will be notified in advance and will retain access to any features they currently use.",
      },
      {
        heading: "Future Pricing",
        body: "Any paid features will be clearly communicated before activation. We will never charge your payment method without your explicit consent.",
      },
      {
        heading: "Refunds",
        body: "If and when paid plans are introduced, our refund policy will be detailed at the time of purchase. We are committed to fair and transparent billing practices.",
      },
    ],
  },
  {
    icon: Ban,
    title: "Acceptable Use",
    content: [
      {
        heading: "Prohibited Activities",
        body: "You agree not to: attempt to gain unauthorised access to other users' accounts or our infrastructure; use Subsense for any unlawful purpose; reverse-engineer, scrape, or otherwise extract data from Subsense; or introduce malicious code or interfere with the service's operation.",
      },
      {
        heading: "Content Standards",
        body: "Any content you enter into Subsense — subscription names, notes, categories — must not be illegal, defamatory, or abusive. While this content is private to your account, we reserve the right to act on content that violates these standards if it comes to our attention.",
      },
      {
        heading: "Consequences of Misuse",
        body: "Violation of these acceptable use standards may result in immediate suspension or termination of your account, without prior notice, at our sole discretion.",
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: "Disclaimers & Liability",
    content: [
      {
        heading: "Service Availability",
        body: 'Subsense is provided "as is" and "as available." We do not guarantee uninterrupted or error-free service. We may perform maintenance or updates that temporarily affect availability, and we will endeavour to communicate these in advance where possible.',
      },
      {
        heading: "Limitation of Liability",
        body: "To the fullest extent permitted by applicable law, Subsense and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including but not limited to loss of data, financial loss, or missed subscription renewals.",
      },
      {
        heading: "Third-Party Services",
        body: "Subsense may display links to third-party services (e.g., links to subscription providers). We are not responsible for the content, terms, or practices of any third-party service.",
      },
    ],
  },
  {
    icon: Scale,
    title: "Intellectual Property",
    content: [
      {
        heading: "Your Data",
        body: "All subscription data you enter into Subsense remains yours. We do not claim ownership over your data and will not use it beyond what is described in our Privacy Policy.",
      },
      {
        heading: "Subsense IP",
        body: "The Subsense name, logo, design, and codebase are the intellectual property of Subsense and its operators. You may not reproduce, distribute, or create derivative works based on our product without express written permission.",
      },
      {
        heading: "Feedback",
        body: "If you share ideas, suggestions, or feedback about Subsense, you grant us a royalty-free, perpetual licence to use that feedback to improve the product. We are not obligated to compensate you for feedback.",
      },
    ],
  },
  {
    icon: RefreshCw,
    title: "Changes to These Terms",
    content: [
      {
        heading: "Updates",
        body: 'We may update these Terms of Service periodically to reflect changes in the law, our practices, or the product. The "Last updated" date at the top of this page will always reflect the most recent revision.',
      },
      {
        heading: "Notification",
        body: "For material changes, we will notify you via email or an in-app notice at least 14 days before the changes take effect. Continued use of Subsense after that date constitutes acceptance of the updated terms.",
      },
      {
        heading: "Governing Law",
        body: "These Terms are governed by and construed in accordance with applicable law. Any disputes arising from these Terms or your use of Subsense shall be resolved through good-faith negotiation in the first instance.",
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

export default function TermsPage() {
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
              "radial-gradient(ellipse at 30% 0%, rgba(124,92,252,0.1) 0%, transparent 60%)",
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
                <FileText size={11} />
                Terms of Service
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-display leading-tight">
              Simple rules,{" "}
              <span className="text-primary">zero surprises.</span>
            </h1>
            <p className="text-base text-muted leading-relaxed max-w-xl">
              These terms govern your use of Subsense. We&apos;ve written them
              to be human-readable — no dense legalese, just clear expectations
              for both of us.
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
          className="rounded-2xl border border-secondary/20 bg-primary/5 p-8 flex flex-col gap-3"
        >
          <h2 className="text-lg font-black font-display">
            Need clarification?
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            If you have any questions about these Terms of Service, contact us
            at{" "}
            <a
              href="mailto:hello@unbuilt.studio"
              className="text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              hello@unbuilt.studio
            </a>
            . We&apos;re happy to clarify anything.
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
            <Link href="/terms" className="text-xs text-primary font-semibold">
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted hover:text-foreground transition-colors font-semibold"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
