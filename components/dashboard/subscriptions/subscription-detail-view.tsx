"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { FadeIn } from "@/components/motion";
import { ConfirmModal } from "@/components/ui";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  SubscriptionHero,
  SubscriptionStats,
  SubscriptionDetailsCard,
  PaymentHistory,
  RoiUsage,
  LinkedAccount,
  SubscriptionFormModal,
} from "@/components/dashboard/subscriptions";
import { PaymentConfirmModal } from "@/components/dashboard/calendar/payment-confirm-modal";
import type { CalendarEvent } from "@/components/dashboard/calendar/calendar-grid";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";

type StatusDialog = "pause" | "resume" | "cancel" | null;

const STATUS_DIALOG_CONFIG: Record<
  NonNullable<StatusDialog>,
  {
    title: string;
    description: string;
    confirmLabel: string;
    confirmVariant: "danger" | "primary";
  }
> = {
  pause: {
    title: "Pause subscription?",
    description:
      "Reminders will stop and it won't count toward your spend totals. You can resume it anytime.",
    confirmLabel: "Pause",
    confirmVariant: "primary",
  },
  resume: {
    title: "Resume subscription?",
    description:
      "This will reactivate the subscription and resume reminders from the next billing date.",
    confirmLabel: "Resume",
    confirmVariant: "primary",
  },
  cancel: {
    title: "Cancel subscription?",
    description:
      "This marks it as cancelled and stops future billing. Past payments and calendar history are preserved.",
    confirmLabel: "Cancel subscription",
    confirmVariant: "danger",
  },
};

export function SubscriptionDetailView() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"subscriptions">;

  const sub = useQuery(api.subscriptions.getSubscriptionById, { id });
  const user = useQuery(api.users.getCurrentUser);
  const updateStatus = useMutation(api.paymentLogs.updateStatus);
  const deleteSubscription = useMutation(api.subscriptions.deleteSubscription);

  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [statusDialog, setStatusDialog] = useState<StatusDialog>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (sub === null) router.replace("/dashboard/subscriptions");
  }, [sub, router]);

  if (sub === undefined || user === undefined) return <DetailSkeleton />;
  if (sub === null) return null;

  const iconInitial = (() => {
    const words = sub.name.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  })();

  function solidColor(rgba: string): string {
    const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? `rgb(${m[1]},${m[2]},${m[3]})` : "#7c5cfc";
  }

  const categoryColor = DEFAULT_CATEGORIES.find(
    (c) => c.name === sub.category
  )?.color;

  const event: CalendarEvent = {
    id: sub._id,
    name: sub.name,
    dotColor: solidColor(sub.iconColor),
    amount: sub.amount,
    currency: sub.currency,
    cycle: sub.cycle,
    paymentMode: sub.paymentMode,
    iconColor: sub.iconColor,
    paymentMethodId: sub.paymentMethodId,
    notes: sub.notes,
  };

  function handleConfirmPayment() {
    setShowPaymentConfirm(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteSubscription({ id });
      router.replace("/dashboard/subscriptions");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleStatusConfirm() {
    if (!statusDialog) return;
    const newStatus =
      statusDialog === "pause"
        ? "paused"
        : statusDialog === "cancel"
          ? "cancelled"
          : "active";
    setIsUpdatingStatus(true);
    setStatusDialog(null);
    try {
      await updateStatus({ id, status: newStatus });
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const isOneOff = sub.cycle === "one-off";

  const canConfirmPayment =
    !isOneOff &&
    sub.paymentMode === "manual" &&
    sub.status !== "cancelled" &&
    sub.status !== "paused" &&
    sub.status !== "lapsed";

  const dialogConfig = statusDialog ? STATUS_DIALOG_CONFIG[statusDialog] : null;

  return (
    <>
      <FadeIn className="flex flex-col gap-6">
        <SubscriptionHero
          name={sub.name}
          status={sub.status}
          plan={sub.plan}
          iconInitial={iconInitial}
          iconColor={sub.iconColor}
          category={sub.category}
          categoryColor={categoryColor}
          onConfirmPayment={
            canConfirmPayment ? () => setShowPaymentConfirm(true) : undefined
          }
          onEdit={() => setShowForm(true)}
          isOneOff={isOneOff}
          onTogglePause={
            !isOneOff && sub.status !== "cancelled" && sub.status !== "lapsed"
              ? () =>
                  setStatusDialog(sub.status === "paused" ? "resume" : "pause")
              : undefined
          }
          onCancel={
            sub.status !== "cancelled" &&
            sub.status !== "expired" &&
            sub.status !== "lapsed"
              ? () => setStatusDialog("cancel")
              : undefined
          }
          onDelete={
            sub.status === "cancelled"
              ? () => setShowDeleteConfirm(true)
              : undefined
          }
          onRenew={
            isOneOff && sub.status === "expired"
              ? () => setShowForm(true)
              : undefined
          }
          isUpdatingStatus={isUpdatingStatus}
        />

        <SubscriptionStats sub={sub} userCurrency={user?.currency ?? "USD"} />

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          <PaymentHistory subscriptionId={id} currency={sub.currency} />

          <div className="flex flex-col gap-6">
            <SubscriptionDetailsCard sub={sub} />
            <RoiUsage subscriptionId={id} />
            <LinkedAccount
              subscriptionId={id}
              defaultEmail={user?.email ?? ""}
              currentLinkedEmail={sub.linkedEmail}
              currentLinkedLabel={sub.linkedLabel}
            />
          </div>
        </div>
      </FadeIn>

      <PaymentConfirmModal
        sub={showPaymentConfirm ? event : null}
        onConfirm={handleConfirmPayment}
        onClose={() => setShowPaymentConfirm(false)}
      />

      {dialogConfig && (
        <ConfirmModal
          open={!!statusDialog}
          title={dialogConfig.title}
          description={dialogConfig.description}
          confirmLabel={dialogConfig.confirmLabel}
          confirmVariant={dialogConfig.confirmVariant}
          isLoading={isUpdatingStatus}
          onConfirm={handleStatusConfirm}
          onClose={() => setStatusDialog(null)}
        />
      )}

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete subscription?"
        description="This permanently removes the subscription and all its payment history. This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
      />

      <SubscriptionFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        editId={id}
      />
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-52 rounded-xl bg-surface border border-border" />
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-24 rounded-xl bg-surface border border-border"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="h-72 rounded-xl bg-surface border border-border" />
        <div className="flex flex-col gap-6">
          <div className="h-48 rounded-xl bg-surface border border-border" />
          <div className="h-20 rounded-xl bg-surface border border-border" />
        </div>
      </div>
    </div>
  );
}
