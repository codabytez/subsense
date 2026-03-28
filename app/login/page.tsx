import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/login-page";

export const metadata: Metadata = {
  title: "Sign In — Subsense",
  description: "Sign in to your Subsense account to manage your subscriptions.",
  alternates: { canonical: "/login" },
  openGraph: {
    type: "website",
    url: "https://subsense.unbuilt.studio/login",
    siteName: "Subsense",
    title: "Sign In — Subsense",
    description:
      "Sign in to your Subsense account to manage your subscriptions.",
  },
  twitter: {
    card: "summary",
    title: "Sign In — Subsense",
    description:
      "Sign in to your Subsense account to manage your subscriptions.",
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginPage />;
}
