"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";
import {
  Category,
  ReceiptItem,
  Calendar,
  Setting2,
  MessageQuestion,
  LogoutCurve,
  ArrowLeft2,
  Add,
  Candle2,
} from "iconsax-reactjs";
import { Button } from "@/components/ui";
import { SubscriptionFormModal } from "@/components/dashboard/subscriptions";
import { SignOutModal } from "@/components/dashboard/sign-out-modal";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Tooltip shown on hover when sidebar is collapsed */
function Tip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-neutral border border-border text-xs font-semibold text-foreground whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
        {label}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const user = useQuery(api.users.getCurrentUser);
  const [showForm, setShowForm] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  // collapsed: icon-only; pinned: stay expanded after nav
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [pinned, setPinned] = useState(() => {
    if (typeof window === "undefined") return true;
    const v = localStorage.getItem("sidebar-pinned");
    return v === null ? true : v === "true";
  });
  // When unpinned: track which pathname the user last expanded on.
  // Sidebar is collapsed on any other page — no effect needed.
  const [expandedPathname, setExpandedPathname] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem("sidebar-pinned", String(pinned));
  }, [pinned]);

  // If pinned, respect user's explicit collapsed state.
  // If unpinned, collapsed unless currently on the page where user expanded.
  const c = pinned ? collapsed : expandedPathname !== pathname;

  return (
    <>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: c ? 68 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col h-screen bg-sidebar shrink-0 py-6 overflow-hidden"
      >
        {/* Logo + tier */}
        <div
          className={cn(
            "flex items-center mb-8 transition-all duration-300",
            c ? "px-3.5 justify-center" : "px-5 gap-3"
          )}
        >
          <Image
            src="/white_logo_mark.svg"
            alt="Subsense"
            width={29}
            height={27}
            className="login-logo-dark shrink-0"
            style={{ width: 28, height: "auto" }}
          />
          <Image
            src="/dark_logo_mark.svg"
            alt="Subsense"
            width={76}
            height={72}
            className="login-logo-light shrink-0"
            style={{ width: 28, height: "auto" }}
          />
          <AnimatePresence>
            {!c && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-[11px] font-bold tracking-widest uppercase text-primary leading-none font-display whitespace-nowrap">
                  Subsense
                </span>
                <span className="text-[10px] tracking-widest uppercase text-muted leading-none mt-1 whitespace-nowrap">
                  Free Tier
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
            const link = (
              <Link
                href={href}
                className={cn(
                  "relative flex items-center min-h-13 transition-colors duration-200 group overflow-hidden",
                  c ? "justify-center px-3 py-3" : "gap-3 px-3 py-3",
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
                <AnimatePresence>
                  {!c && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="active-bar"
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-13 bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
            return (
              <motion.div key={href} variants={itemVariants}>
                {c ? <Tip label={label}>{link}</Tip> : link}
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
          {/* Add subscription */}
          <div className={cn("mb-2", c ? "flex justify-center" : "px-2")}>
            {c ? (
              <Tip label="Add Subscription">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Add size={18} color="#fff" />
                </button>
              </Tip>
            ) : (
              <Button
                variant="primary"
                className="w-full text-[11px] font-bold tracking-widest uppercase rounded-xl"
                onClick={() => setShowForm(true)}
              >
                Add Subscription
              </Button>
            )}
          </div>

          {/* Support */}
          {c ? (
            <Tip label="Support">
              <Link
                href="/dashboard/support"
                className="flex justify-center items-center py-2.5 rounded-lg text-muted hover:text-foreground hover:bg-white/3 transition-colors duration-200"
              >
                <MessageQuestion
                  size={20}
                  variant="Outline"
                  color="currentColor"
                />
              </Link>
            </Tip>
          ) : (
            <Link
              href="/dashboard/support"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-semibold tracking-widest uppercase text-muted hover:text-foreground hover:bg-white/3 transition-colors duration-200"
            >
              <MessageQuestion
                size={20}
                variant="Outline"
                color="currentColor"
              />
              Support
            </Link>
          )}

          {/* Sign out */}
          {c ? (
            <Tip label="Sign Out">
              <button
                onClick={() => setShowSignOut(true)}
                className="flex justify-center items-center w-full py-2.5 rounded-lg text-muted hover:text-foreground hover:bg-white/3 transition-colors duration-200 cursor-pointer"
              >
                <LogoutCurve size={20} variant="Outline" color="currentColor" />
              </button>
            </Tip>
          ) : (
            <button
              onClick={() => setShowSignOut(true)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-semibold tracking-widest uppercase text-muted hover:text-foreground hover:bg-white/3 transition-colors duration-200 w-full cursor-pointer"
            >
              <LogoutCurve size={20} variant="Outline" color="currentColor" />
              Sign Out
            </button>
          )}

          {/* User profile strip */}
          {user === undefined ? (
            <div
              className={cn(
                "flex items-center mt-2 px-3 py-2.5 rounded-xl animate-pulse",
                c ? "justify-center" : "gap-3"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
              {!c && (
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-2.5 w-32 bg-white/[0.07] rounded" />
                </div>
              )}
            </div>
          ) : c ? (
            <Tip label={user?.name ?? "Profile"}>
              <Link
                href="/dashboard/settings"
                className="flex justify-center mt-2 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors duration-200"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary shrink-0 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt="avatar"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-[11px] font-black text-white">
                      {user?.name ? initials(user.name) : "—"}
                    </span>
                  )}
                </div>
              </Link>
            </Tip>
          ) : (
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 mt-2 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors duration-200 group"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary shrink-0 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-[11px] font-black text-white">
                    {user?.name ? initials(user.name) : "—"}
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-foreground truncate leading-none">
                  {user?.name ?? "—"}
                </span>
                <span className="text-[10px] text-muted mt-0.5 truncate">
                  {user?.email ?? ""}
                </span>
              </div>
            </Link>
          )}

          {/* Collapse / Pin controls */}
          <div
            className={cn(
              "flex items-center mt-3 pt-3 border-t border-border",
              c ? "justify-center flex-col gap-2" : "justify-between px-2"
            )}
          >
            {/* Pin toggle */}
            <Tip label={pinned ? "Unpin sidebar" : "Pin sidebar"}>
              <button
                onClick={() => {
                  const next = !pinned;
                  setPinned(next);
                  if (next) {
                    setCollapsed(false);
                    setExpandedPathname(null);
                  }
                }}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
                  pinned
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                )}
              >
                <Candle2
                  size={15}
                  variant={pinned ? "Bold" : "Outline"}
                  color="currentColor"
                />
              </button>
            </Tip>

            {/* Collapse toggle */}
            <Tip label={c ? "Expand sidebar" : "Collapse sidebar"}>
              <button
                onClick={() => {
                  if (pinned) {
                    setCollapsed((v) => !v);
                  } else {
                    setExpandedPathname((prev) =>
                      prev === pathname ? null : pathname
                    );
                  }
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <motion.div
                  animate={{ rotate: c ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowLeft2 size={15} color="currentColor" />
                </motion.div>
              </button>
            </Tip>
          </div>
        </motion.div>
      </motion.aside>

      <SubscriptionFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />
      <SignOutModal open={showSignOut} onClose={() => setShowSignOut(false)} />
    </>
  );
}
