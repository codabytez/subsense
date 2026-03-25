"use client";

import { useState } from "react";
import {
  MessageQuestion,
  BookSquare,
  People,
  Activity,
  ExportSquare,
  Send2,
} from "iconsax-reactjs";
import { FadeIn } from "@/components/motion";
import { FaqAccordion } from "@/components/dashboard/support";

const QUICK_LINKS = [
  {
    icon: BookSquare,
    title: "Documentation",
    description: "Guides, tutorials, and API reference",
  },
  {
    icon: People,
    title: "Community",
    description: "Join the SubSense community forum",
  },
  {
    icon: Activity,
    title: "System Status",
    description: "Live uptime and incident reports",
  },
];

const FAQ = [
  {
    category: "Billing",
    items: [
      {
        question: "How do I update my payment method?",
        answer:
          "Go to Settings → Linked Cards and tap 'Add New Card'. You can set any card as primary for auto-pay subscriptions.",
      },
      {
        question: "When am I charged?",
        answer:
          "SubSense doesn't process payments — it tracks them. Auto subscriptions are marked paid on their renewal date automatically. Manual ones prompt you to confirm.",
      },
      {
        question: "Can I get a refund on a subscription?",
        answer:
          "SubSense is a tracking tool and doesn't handle payments directly. Contact the subscription provider's support for refund requests.",
      },
    ],
  },
  {
    category: "Subscriptions",
    items: [
      {
        question: "How do I add a new subscription?",
        answer:
          "From the Subscriptions page, tap the '+' button, fill in the service name, amount, billing cycle, and payment mode.",
      },
      {
        question: "Can I track free trials?",
        answer:
          "Yes — set the status to 'Trial' when adding a subscription. SubSense will surface it in your calendar so you don't get surprised by the charge.",
      },
      {
        question:
          "What's the difference between Auto and Manual payment modes?",
        answer:
          "Auto subscriptions are marked as paid automatically on their renewal date. Manual ones require you to confirm payment via the calendar or detail page.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        question: "How do I change my email address?",
        answer:
          "Go to Settings → Profile and update the Email Address field, then hit Save Changes.",
      },
      {
        question: "Can I export my subscription data?",
        answer:
          "Yes — Settings → Data & Privacy gives you CSV and PDF export options for your full subscription history.",
      },
    ],
  },
  {
    category: "Privacy",
    items: [
      {
        question: "Is my financial data secure?",
        answer:
          "SubSense never connects to your bank or card accounts. All data is entered manually and stored encrypted at rest.",
      },
      {
        question: "Who can see my subscriptions?",
        answer:
          "Only you. Your data is private, never shared with third parties, and never used for advertising.",
      },
    ],
  },
];

const SUBJECTS = [
  "Billing Issue",
  "Bug Report",
  "Feature Request",
  "Account Help",
  "Other",
];

export default function SupportPage() {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [subjectOpen, setSubjectOpen] = useState(false);

  return (
    <FadeIn className="flex flex-col gap-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
        <p className="text-sm text-muted mt-1">
          Find answers, get in touch, or browse our resources.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ icon: Icon, title, description }) => (
          <button
            key={title}
            className="flex items-start justify-between gap-4 p-5 bg-surface border border-border rounded-2xl hover:border-primary/40 transition-colors duration-200 text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={18} color="var(--color-primary)" variant="Bold" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-xs text-muted mt-0.5">{description}</p>
              </div>
            </div>
            <ExportSquare
              size={14}
              color="var(--color-muted)"
              className="shrink-0 mt-0.5 group-hover:text-primary transition-colors"
            />
          </button>
        ))}
      </div>

      {/* FAQ + Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
        {/* FAQ */}
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <MessageQuestion
              size={15}
              color="var(--color-primary)"
              variant="Bold"
            />
            <p className="text-xs font-bold tracking-widest uppercase text-foreground">
              Frequently Asked Questions
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {FAQ.map(({ category, items }) => (
              <div key={category}>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-1">
                  {category}
                </p>
                <FaqAccordion items={items} />
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Send2 size={15} color="var(--color-primary)" variant="Bold" />
            <p className="text-xs font-bold tracking-widest uppercase text-foreground">
              Contact Us
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                  Name
                </p>
                <input
                  placeholder="Alex Sterling"
                  className="w-full bg-neutral rounded-xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted/50 outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                  Email
                </p>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-neutral rounded-xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted/50 outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                Subject
              </p>
              <div className="relative">
                <button
                  onClick={() => setSubjectOpen((o) => !o)}
                  className="w-full flex items-center justify-between bg-neutral rounded-xl px-4 py-3 text-sm font-semibold text-foreground outline-none hover:ring-1 hover:ring-primary/40 transition-all"
                >
                  {subject}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      transform: subjectOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="var(--color-muted)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {subjectOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface border border-border rounded-xl overflow-hidden shadow-lg z-10">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSubject(s);
                          setSubjectOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                          s === subject
                            ? "text-primary bg-primary/10"
                            : "text-muted hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">
                Message
              </p>
              <textarea
                rows={6}
                placeholder="Describe your issue or question..."
                className="w-full bg-neutral rounded-xl px-4 py-3 text-sm font-semibold text-foreground placeholder:text-muted/50 outline-none focus:ring-1 focus:ring-primary/40 transition-all resize-none"
              />
            </div>

            <button
              className="w-full py-3.5 rounded-xl text-sm font-black text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Send2 size={15} color="currentColor" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
