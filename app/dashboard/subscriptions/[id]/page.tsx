"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion";
import {
  SubscriptionHero,
  SubscriptionStats,
  PaymentHistory,
  RoiUsage,
  LinkedAccount,
} from "@/components/dashboard/subscriptions";
import { PaymentConfirmModal } from "@/components/dashboard/calendar/payment-confirm-modal";
import type { CalendarEvent } from "@/components/dashboard/calendar/calendar-grid";

// Mock — will be replaced with backend data fetching
const subscription = {
  name: "Netflix Premium",
  status: "active" as SubscriptionStatus,
  plan: "4K · HDR",
  iconInitial: "M",
  iconBg: "bg-tertiary",
  gradientColor: "#c0392b",
  linkedEmail: "m.jackson@gmail.com",
  linkedLabel: "Primary Billing Email",
  linkedIconInitial: "N",
  linkedIconBg: "bg-tertiary",
  amount: 15.99,
  paymentMode: "manual" as const,
};

export default function SubscriptionDetailPage() {
  const [showModal, setShowModal] = useState(false);
  const [paid, setPaid] = useState(false);

  const event: CalendarEvent = {
    name: subscription.name,
    dotColor: "#e50914",
    amount: subscription.amount,
    paymentMode: subscription.paymentMode,
  };

  return (
    <>
      <FadeIn className="flex flex-col gap-6">
        <SubscriptionHero
          name={subscription.name}
          status={subscription.status}
          plan={subscription.plan}
          iconInitial={subscription.iconInitial}
          iconBg={subscription.iconBg}
          gradientColor={subscription.gradientColor}
          onConfirmPayment={!paid ? () => setShowModal(true) : undefined}
        />

        <SubscriptionStats />

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          <PaymentHistory />

          <div className="flex flex-col gap-6">
            <RoiUsage />
            <LinkedAccount
              email={subscription.linkedEmail}
              label={subscription.linkedLabel}
              iconInitial={subscription.linkedIconInitial}
              iconBg={subscription.linkedIconBg}
            />
          </div>
        </div>
      </FadeIn>

      <PaymentConfirmModal
        sub={showModal ? event : null}
        onConfirm={() => {
          setPaid(true);
          setShowModal(false);
        }}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
