import type { Metadata } from "next";
import { SubscriptionsView } from "@/components/dashboard/subscriptions";

export const metadata: Metadata = {
  title: "Subscriptions — Subsense",
  description:
    "Manage all your subscriptions in one place. Track, edit, and cancel recurring payments.",
  alternates: {
    canonical: "/dashboard/subscriptions",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/dashboard/subscriptions",
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
  return <SubscriptionsView />;
}
