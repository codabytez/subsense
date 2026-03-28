import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/overview";

export const metadata: Metadata = {
  title: "Overview — Subsense",
  description:
    "Your subscription overview — monthly burn, upcoming renewals, and spending insights at a glance.",
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/dashboard",
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
  return <DashboardPage />;
}
