"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type Variants, type Transition } from "framer-motion";
import {
  Category,
  ReceiptItem,
  Calendar,
  Setting2,
  MessageQuestion,
  LogoutCurve,
} from "iconsax-reactjs";
import { Button } from "@/components/ui";
import { SubscriptionFormModal } from "@/components/dashboard/subscriptions";
import { SignOutModal } from "@/components/dashboard/sign-out-modal";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Category },
  {
    label: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: ReceiptItem,
  },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Settings", href: "/dashboard/settings", icon: Setting2 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 } as Transition,
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ease: "easeOut" as const, duration: 0.3 } as Transition,
  },
};

export function Sidebar() {
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col h-screen w-60 bg-sidebar shrink-0 py-6"
      >
        {/* Logo + tier */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-3 px-5 mb-8"
        >
          <Image
            src="/white_logo_mark.svg"
            alt="Subsense"
            width={29}
            height={27}
            className="login-logo-dark"
            style={{ width: 28, height: "auto" }}
          />
          <Image
            src="/dark_logo_mark.svg"
            alt="Subsense"
            width={76}
            height={72}
            className="login-logo-light"
            style={{ width: 28, height: "auto" }}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-widest uppercase text-primary leading-none font-display">
              Subsense
            </span>
            <span className="text-[10px] tracking-widest uppercase text-muted leading-none mt-1">
              Premium Tier
            </span>
          </div>
        </motion.div>

        {/* Nav */}
        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col gap-0.5"
        >
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <motion.div key={href} variants={itemVariants}>
                <Link
                  href={href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-3 min-h-13 transition-colors duration-200 group overflow-hidden",
                    isActive
                      ? "bg-primary/5 text-primary"
                      : "text-muted hover:text-foreground hover:bg-white/3"
                  )}
                >
                  <Icon
                    size={20}
                    variant={isActive ? "Bold" : "Outline"}
                    color="currentColor"
                  />
                  <span className="text-[11px] font-semibold tracking-widest uppercase">
                    {label}
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="active-bar"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-13 bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
          className="px-3 flex flex-col gap-1"
        >
          <div className="px-2 mb-2">
            <Button
              variant="primary"
              className="w-full text-[11px] font-bold tracking-widest uppercase rounded-xl"
              onClick={() => setShowForm(true)}
            >
              Add Subscription
            </Button>
          </div>

          <Link
            href="/dashboard/support"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-semibold tracking-widest uppercase text-muted hover:text-foreground hover:bg-white/3 transition-colors duration-200"
          >
            <MessageQuestion size={20} variant="Outline" color="currentColor" />
            Support
          </Link>

          <button
            onClick={() => setShowSignOut(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-semibold tracking-widest uppercase text-muted hover:text-foreground hover:bg-white/3 transition-colors duration-200 w-full cursor-pointer"
          >
            <LogoutCurve size={20} variant="Outline" color="currentColor" />
            Sign Out
          </button>
        </motion.div>
      </motion.aside>

      <SubscriptionFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={() => setShowForm(false)}
      />
      <SignOutModal open={showSignOut} onClose={() => setShowSignOut(false)} />
    </>
  );
}
