"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Category,
  ReceiptItem,
  ChartSquare,
  Card,
  Setting2,
} from "iconsax-reactjs";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Category },
  { label: "Subs", href: "/dashboard/subscriptions", icon: ReceiptItem },
  { label: "Analytics", href: "/dashboard/analytics", icon: ChartSquare },
  { label: "Cards", href: "/dashboard/cards", icon: Card },
  { label: "Settings", href: "/dashboard/settings", icon: Setting2 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-[56px]"
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
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
  );
}
