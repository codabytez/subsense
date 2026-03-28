import type { Metadata } from "next";
import { SettingsView } from "@/components/dashboard/settings";

export const metadata: Metadata = {
  title: "Settings — Subsense",
  description:
    "Manage your Subsense account settings, notifications, payment methods, and preferences.",
  alternates: {
    canonical: "/dashboard/settings",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/dashboard/settings",
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
  return <SettingsView />;
}
