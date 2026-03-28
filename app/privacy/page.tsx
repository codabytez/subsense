import type { Metadata } from "next";
import { PrivacyPage } from "@/components/legal/privacy-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Subsense",
  description:
    "Learn how Subsense collects, uses, and protects your personal data. We're committed to your privacy.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/privacy",
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
  return <PrivacyPage />;
}
