import type { Metadata } from "next";
import { CalendarView } from "@/components/dashboard/calendar";

export const metadata: Metadata = {
  title: "Calendar — Subsense",
  description:
    "View all your upcoming subscription renewals on a calendar. Never miss a payment.",
  alternates: {
    canonical: "/dashboard/calendar",
  },
  openGraph: {
    url: "https://subsense.unbuilt.studio/dashboard/calendar",
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
  return <CalendarView />;
}
