import type { Metadata } from "next";
import { SupportView } from "@/components/dashboard/support";

export const metadata: Metadata = {
  title: "Support — Subsense",
  description: "Get help with Subsense. Browse our FAQ or contact us directly.",
  alternates: {
    canonical: "/dashboard/support",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/dashboard/support",
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
  return <SupportView />;
}
