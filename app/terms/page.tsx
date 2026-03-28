import type { Metadata } from "next";
import { TermsPage } from "@/components/legal/terms-page";

export const metadata: Metadata = {
  title: "Terms of Service — Subsense",
  description:
    "Read Subsense's Terms of Service. Simple rules, zero surprises — written in plain language.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/terms",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <TermsPage />;
}
