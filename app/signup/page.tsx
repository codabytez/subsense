import type { Metadata } from "next";
import { SignupPage } from "@/components/auth/signup-page";

export const metadata: Metadata = {
  title: "Create Account — Subsense",
  description:
    "Create your free Subsense account and start tracking all your subscriptions in one place.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/signup",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Subsense",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SignupPage />;
}
