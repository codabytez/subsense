import type { Metadata } from "next";
import { VerifyEmailPage } from "@/components/auth/verify-email-page";

export const metadata: Metadata = {
  title: "Verify Email — Subsense",
  description: "Verify your email address to activate your Subsense account.",
  alternates: {
    canonical: "/verify-email",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/verify-email",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <VerifyEmailPage />;
}
