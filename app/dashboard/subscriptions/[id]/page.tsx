import type { Metadata } from "next";
import { SubscriptionDetailView } from "@/components/dashboard/subscriptions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Subscription Details — Subsense`,
    description:
      "View and manage this subscription's details, payment history, and renewal info.",
    alternates: { canonical: `/dashboard/subscriptions/${id}` },
    twitter: { card: "summary" },
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <SubscriptionDetailView />;
}
