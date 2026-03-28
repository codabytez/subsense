import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/components/auth/forgot-password-page";

export const metadata: Metadata = {
  title: "Forgot Password — Subsense",
  description:
    "Reset your Subsense password. Enter your email and we'll send you a reset link.",
  alternates: {
    canonical: "/forgot-password",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/forgot-password",
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
  return <ForgotPasswordPage />;
}
