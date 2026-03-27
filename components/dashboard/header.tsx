"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchNormal1, Notification } from "iconsax-reactjs";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function Header() {
  const pathname = usePathname();
  const user = useQuery(api.users.getCurrentUser);

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
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <span className="text-sm font-semibold tracking-widest text-foreground font-display uppercase truncate max-w-32">
            {user?.name ?? "—"}
          </span>
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
      </motion.div>
    </header>
  );
}
