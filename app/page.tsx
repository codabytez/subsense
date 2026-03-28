import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Subsense — Every subscription, perfectly tracked",
  description:
    "One dashboard for all your recurring costs. Track subscriptions, get renewal alerts, and cut what you don't use. Free forever.",
  metadataBase: new URL("https://subsense.unbuilt.studio"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://subsense.unbuilt.studio",
    siteName: "Subsense",
    title: "Subsense — Every subscription, perfectly tracked",
    description:
      "One dashboard for all your recurring costs. Track subscriptions, get renewal alerts, and cut what you don't use. Free forever.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Subsense — Subscription tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@subsense",
    title: "Subsense — Every subscription, perfectly tracked",
    description:
      "One dashboard for all your recurring costs. Track subscriptions, get renewal alerts, and cut what you don't use.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function Page() {
  return <LandingPage />;
}
