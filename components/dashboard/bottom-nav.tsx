"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Category,
  ReceiptItem,
  Calendar,
  Setting2,
  Add,
} from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { SubscriptionFormModal } from "@/components/dashboard/subscriptions";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Category },
  { label: "Subs", href: "/dashboard/subscriptions", icon: ReceiptItem },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Settings", href: "/dashboard/settings", icon: Setting2 },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-border md:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {/* First two nav items */}
          {navItems.slice(0, 2).map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-1 min-w-14"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    variant={isActive ? "Bold" : "Outline"}
                    color={
                      isActive ? "var(--color-primary)" : "var(--color-muted)"
                    }
                  />
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-wide",
                    isActive ? "text-primary" : "text-muted"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Centre FAB */}
          <button
            onClick={() => setShowForm(true)}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 -mt-5">
              <Add size={22} color="#fff" />
            </div>
            <span className="text-[10px] font-medium tracking-wide text-muted mt-0.5">
              Add
            </span>
          </button>

          {/* Last two nav items */}
          {navItems.slice(2).map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-1 min-w-14"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    variant={isActive ? "Bold" : "Outline"}
                    color={
                      isActive ? "var(--color-primary)" : "var(--color-muted)"
                    }
                  />
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-wide",
                    isActive ? "text-primary" : "text-muted"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <SubscriptionFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </>
  );
}
