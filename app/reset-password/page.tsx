import type { Metadata } from "next";
import { ResetPasswordPage } from "@/components/auth/reset-password-page";

export const metadata: Metadata = {
  title: "Reset Password — Subsense",
  description: "Set a new password for your Subsense account.",
  alternates: {
    canonical: "/reset-password",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/reset-password",
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
  return <ResetPasswordPage />;
}
