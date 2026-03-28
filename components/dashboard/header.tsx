"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SearchNormal1,
  Notification,
  TickCircle,
  Warning2,
  Clock,
  MoneyRecive,
  MoneyChange,
} from "iconsax-reactjs";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/lib/currency";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const NOTIF_ICON: Record<string, React.ElementType> = {
  reminder: Clock,
  overdue: Warning2,
  payment_confirmed: TickCircle,
  auto_payment: MoneyRecive,
  price_change: MoneyChange,
};

const NOTIF_COLOR: Record<string, string> = {
  reminder: "var(--color-primary)",
  overdue: "var(--color-tertiary)",
  payment_confirmed: "var(--color-secondary)",
  auto_payment: "var(--color-secondary)",
  price_change: "var(--color-primary)",
};

function NotificationItem({
  notif,
  onRead,
}: {
  notif: Doc<"inbox">;
  onRead: (id: Doc<"inbox">["_id"]) => void;
}) {
  const router = useRouter();
  const Icon = NOTIF_ICON[notif.type] ?? Notification;
  const color = NOTIF_COLOR[notif.type] ?? "var(--color-primary)";

  const timeAgo = formatDistanceToNow(new Date(notif._creationTime), {
    addSuffix: true,
  });

  function handleClick() {
    if (!notif.read) onRead(notif._id);
    if (notif.link) router.push(notif.link);
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5",
        !notif.read && "bg-primary/5"
      )}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={14} color={color} variant="Bold" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-snug",
            notif.read ? "text-muted" : "text-foreground font-semibold"
          )}
        >
          {notif.title}
        </p>
        <p className="text-xs text-muted mt-0.5 truncate">{notif.message}</p>
        <p className="text-[10px] text-muted/60 mt-1">{timeAgo}</p>
      </div>
      {!notif.read && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </button>
  );
}

type SearchResult = {
  _id: string;
  name: string;
  category: string;
  amount: number;
  currency: string;
  status: string;
};

function SearchDropdown({
  results,
  cursor,
  onSelect,
  router,
}: {
  results: SearchResult[];
  cursor: number;
  onSelect: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  if (results.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full mt-2 left-0 right-0 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
    >
      {results.map((s, i) => (
        <button
          key={s._id}
          onClick={() => {
            router.push(`/dashboard/subscriptions/${s._id}`);
            onSelect();
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
            i === cursor ? "bg-primary/10" : "hover:bg-white/5"
          )}
        >
          <div
            className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-[11px] font-black text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {s.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {s.name}
            </p>
            <p className="text-[11px] text-muted truncate">{s.category}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold font-mono text-foreground">
              {formatAmount(s.amount, s.currency)}
            </p>
            <p
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide",
                s.status === "active" ? "text-secondary" : "text-muted"
              )}
            >
              {s.status}
            </p>
          </div>
        </button>
      ))}
    </motion.div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const notifications = useQuery(api.inbox.getNotifications);
  const unreadCount = useQuery(api.inbox.getUnreadCount);
  const markAsRead = useMutation(api.inbox.markAsRead);
  const markAllAsRead = useMutation(api.inbox.markAllAsRead);

  const subscriptions = useQuery(api.subscriptions.getSubscriptions);

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCursor, setSearchCursor] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchResults =
    searchQuery.trim().length < 1
      ? []
      : (subscriptions ?? [])
          .filter((s) => {
            const q = searchQuery.toLowerCase();
            return (
              s.name.toLowerCase().includes(q) ||
              s.category.toLowerCase().includes(q) ||
              (s.plan ?? "").toLowerCase().includes(q)
            );
          })
          .slice(0, 6);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchCursor(-1);
  }

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      closeSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSearchCursor((c) => Math.min(c + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSearchCursor((c) => Math.max(c - 1, 0));
    } else if (
      e.key === "Enter" &&
      searchCursor >= 0 &&
      searchResults[searchCursor]
    ) {
      router.push(
        `/dashboard/subscriptions/${searchResults[searchCursor]._id}`
      );
      closeSearch();
    }
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (pathname === "/dashboard/settings") return null;

  const hasUnread = (unreadCount ?? 0) > 0;

  return (
    <header className="flex items-center justify-between px-4 md:px-6 h-16 border-b border-border">
      {/* Search — hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:block relative w-full max-w-sm"
      >
        <div className="flex items-center gap-3 bg-surface rounded-full px-4 py-2.5">
          <SearchNormal1
            size={16}
            color="var(--color-muted)"
            variant="Outline"
          />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchCursor(-1);
            }}
            onKeyDown={handleSearchKey}
            className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none w-full"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchCursor(-1);
              }}
              className="text-muted hover:text-foreground text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
        <AnimatePresence>
          {searchResults.length > 0 && (
            <SearchDropdown
              results={searchResults}
              cursor={searchCursor}
              onSelect={closeSearch}
              router={router}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile: brand + expandable search */}
      <div className="flex md:hidden items-center gap-2 flex-1 mr-3">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search-open"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full"
            >
              <div className="flex items-center gap-2 bg-surface rounded-full px-4 py-2 w-full">
                <SearchNormal1
                  size={15}
                  color="var(--color-muted)"
                  variant="Outline"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchCursor(-1);
                  }}
                  onKeyDown={handleSearchKey}
                  className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none flex-1"
                />
                <button
                  onClick={closeSearch}
                  className="text-muted hover:text-foreground transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <SearchDropdown
                    results={searchResults}
                    cursor={searchCursor}
                    onSelect={closeSearch}
                    router={router}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="search-closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3"
            >
              <span className="text-sm font-bold tracking-widest uppercase text-primary font-display">
                Subsense
              </span>
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
                className="text-muted hover:text-foreground transition-colors"
              >
                <SearchNormal1
                  size={18}
                  variant="Outline"
                  color="currentColor"
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-3 md:gap-4 shrink-0"
      >
        {/* Notification bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative text-muted hover:text-foreground transition-colors"
          >
            <Notification size={22} variant="Outline" color="currentColor" />
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-primary rounded-full flex items-center justify-center px-1">
                <span className="text-[9px] font-black text-white leading-none">
                  {(unreadCount ?? 0) > 99 ? "99+" : unreadCount}
                </span>
              </span>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-10 w-[calc(100vw-2rem)] max-w-80 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-bold text-foreground">
                    Notifications
                  </span>
                  {hasUnread && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-[10px] font-bold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications === undefined ? (
                    <div className="animate-pulse divide-y divide-border">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 px-4 py-3"
                        >
                          <div className="w-8 h-8 rounded-xl bg-white/10 shrink-0 mt-0.5" />
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="h-3 w-3/4 bg-white/10 rounded" />
                            <div className="h-2.5 w-full bg-white/[0.07] rounded" />
                            <div className="h-2 w-12 bg-white/5 rounded mt-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <p className="text-sm text-muted">
                        No notifications yet.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-border">
                      {notifications.map((n) => (
                        <li key={n._id}>
                          <NotificationItem
                            notif={n}
                            onRead={(id) => markAsRead({ id })}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-border" />

        {/* User */}
        {user === undefined ? (
          <div className="flex items-center gap-2.5 animate-pulse">
            <div className="h-3.5 w-20 bg-white/10 rounded" />
            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
          </div>
        ) : (
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <span className="hidden md:block text-sm font-semibold tracking-widest text-foreground font-display uppercase truncate max-w-32">
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
        )}
      </motion.div>
    </header>
  );
}
