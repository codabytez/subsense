"use client";

import { SearchNormal1, Notification, ProfileCircle } from "iconsax-reactjs";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/dashboard/settings") return null;

  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-border">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 bg-surface rounded-full px-4 py-2.5 w-full max-w-sm"
      >
        <SearchNormal1 size={16} color="var(--color-muted)" variant="Outline" />
        <input
          type="text"
          placeholder="Search subscriptions..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none w-full"
        />
      </motion.div>

      {/* Right side */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-4"
      >
        {/* Notification bell */}
        <button className="relative text-muted hover:text-foreground transition-colors">
          <Notification size={22} variant="Outline" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-border" />

        {/* User */}
        <button className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <span className="text-sm font-semibold tracking-widest text-foreground font-display uppercase">
            Alex Mercer
          </span>
          <ProfileCircle
            size={28}
            color="var(--color-muted)"
            variant="Outline"
          />
        </button>
      </motion.div>
    </header>
  );
}
