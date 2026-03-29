"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationControls,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Bell,
  BarChart3,
  Globe,
  Repeat,
  TrendingDown,
  Zap,
  ChevronRight,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { authClient } from "@/lib/auth-client";

/* ─── easing ────────────────────────────────────────── */
const expo = [0.22, 1, 0.36, 1] as const;

/* ─── variants ──────────────────────────────────────── */
const rise: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: expo, delay: i * 0.1 },
  }),
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: expo, delay: i * 0.1 },
  }),
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: expo, delay: i * 0.1 },
  }),
};

/* ─── animated counter ───────────────────────────────── */
function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const duration = 2000;
          const tick = (now: number) => {
            const p = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setCount(parseFloat((ease * to).toFixed(decimals)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── mock subscription data ─────────────────────────── */
const MOCK_SUBS = [
  {
    name: "Netflix",
    amount: "$15.99",
    color: "#E50914",
    cycle: "Monthly",
    due: "Tomorrow",
    urgent: true,
  },
  {
    name: "Spotify",
    amount: "$9.99",
    color: "#1DB954",
    cycle: "Monthly",
    due: "Apr 2",
    urgent: false,
  },
  {
    name: "Figma",
    amount: "$45.00",
    color: "#A259FF",
    cycle: "Monthly",
    due: "Apr 5",
    urgent: false,
  },
  {
    name: "AWS",
    amount: "$82.40",
    color: "#FF9900",
    cycle: "Monthly",
    due: "Apr 9",
    urgent: false,
  },
  {
    name: "Linear",
    amount: "$8.00",
    color: "#5E6AD2",
    cycle: "Monthly",
    due: "Apr 14",
    urgent: false,
  },
];

const MOCK_STATS = [
  { label: "Active Subscriptions", value: "12", badge: "+2 New" },
  { label: "Annual Projected Total", value: "$2,847.60" },
  { label: "Highest Cost Item", value: "AWS", sub: "$82.40/mo" },
];

const BAR_HEIGHTS = [30, 55, 42, 75, 50, 88, 62];

/* ─── interactive dashboard mockup ──────────────────── */
function DashboardMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 120, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 20 });
  const [hoveredSub, setHoveredSub] = useState<number | null>(null);
  const [activeStat, setActiveStat] = useState<number | null>(null);
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      rotateY.set(dx * 10);
      rotateX.set(-dy * 6);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="w-full cursor-default"
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
        className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-1.5 px-4 py-3 border-b border-white/6"
          style={{ background: "#131319" }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1 h-5 rounded-md bg-white/5 flex items-center px-3">
            <span className="text-[10px] text-white/20 font-mono">
              subsense.unbuilt.studio/dashboard
            </span>
          </div>
        </div>

        <div className="flex" style={{ background: "#0e0e13" }}>
          {/* Sidebar */}
          <div
            className="w-14 shrink-0 border-r border-white/6 flex flex-col items-center gap-4 py-5"
            style={{ background: "#13151f" }}
          >
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-sm bg-primary" />
            </div>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.15,
                  backgroundColor: "rgba(124,92,252,0.1)",
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <div className="w-3 h-3 rounded-sm bg-white/10" />
              </motion.div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 overflow-hidden p-4 flex flex-col gap-3">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {MOCK_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + i * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: "rgba(124,92,252,0.4)",
                  }}
                  onHoverStart={() => setActiveStat(i)}
                  onHoverEnd={() => setActiveStat(null)}
                  className="rounded-xl border border-white/6 p-3 flex flex-col gap-1.5 cursor-pointer transition-colors"
                  style={{ background: "#131319" }}
                >
                  <span className="text-[9px] font-semibold tracking-widest uppercase text-white/30">
                    {s.label}
                  </span>
                  <span
                    className="text-sm font-black font-mono leading-tight transition-colors"
                    style={{ color: activeStat === i ? "#7c5cfc" : "#f5f5f7" }}
                  >
                    {s.value}
                  </span>
                  {s.badge && (
                    <span className="text-[8px] font-bold text-secondary bg-secondary/10 border border-secondary/20 rounded-full px-1.5 py-0.5 self-start">
                      {s.badge}
                    </span>
                  )}
                  {s.sub && (
                    <span className="text-[9px] text-white/30 font-mono">
                      {s.sub}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Content row */}
            <div className="flex gap-3" style={{ height: 320 }}>
              {/* Subscription list */}
              <div
                className="flex-1 rounded-xl border border-white/6 overflow-hidden flex flex-col"
                style={{ background: "#131319" }}
              >
                <div className="px-4 pt-3 pb-2 border-b border-white/4 flex items-center justify-between">
                  <span className="text-[9px] font-black tracking-widest uppercase text-white/40">
                    Subscriptions
                  </span>
                  <span className="text-[9px] text-primary font-semibold">
                    View all →
                  </span>
                </div>
                <div className="flex flex-col overflow-hidden divide-y divide-white/4">
                  {MOCK_SUBS.map((sub, i) => (
                    <motion.div
                      key={sub.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.4 + i * 0.09,
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        backgroundColor: "rgba(124,92,252,0.05)",
                        x: 3,
                      }}
                      onHoverStart={() => setHoveredSub(i)}
                      onHoverEnd={() => setHoveredSub(null)}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                    >
                      <motion.div
                        animate={{ scale: hoveredSub === i ? 1.1 : 1 }}
                        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-black"
                        style={{
                          backgroundColor: sub.color + "25",
                          border: `1px solid ${sub.color}30`,
                          color: sub.color,
                        }}
                      >
                        {sub.name[0]}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[11px] font-semibold truncate"
                          style={{
                            color:
                              hoveredSub === i
                                ? "#f5f5f7"
                                : "rgba(245,245,247,0.7)",
                          }}
                        >
                          {sub.name}
                        </p>
                        <p className="text-[9px] text-white/30">{sub.cycle}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-black text-white font-mono">
                          {sub.amount}
                        </p>
                        <AnimatePresence>
                          {sub.urgent ? (
                            <motion.p
                              initial={{ opacity: 0.6 }}
                              animate={{ opacity: [0.6, 1, 0.6] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="text-[9px] font-bold"
                              style={{ color: "#f97066" }}
                            >
                              {sub.due}
                            </motion.p>
                          ) : (
                            <p className="text-[9px] text-white/30">
                              {sub.due}
                            </p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right panel */}
              <div className="w-44 shrink-0 flex flex-col gap-2.5">
                {/* Burn card */}
                <div
                  className="flex-1 rounded-xl border border-white/6 p-4 flex flex-col gap-2"
                  style={{ background: "#131319" }}
                >
                  <span className="text-[9px] font-semibold tracking-widest uppercase text-white/30">
                    Monthly Burn
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="text-xs text-white/20 font-mono">$</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="text-3xl font-black font-mono"
                      style={{ color: "rgba(245,245,247,0.15)" }}
                    >
                      237
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.85, duration: 0.6 }}
                      className="text-3xl font-black font-mono text-primary -mt-1"
                    >
                      .30
                    </motion.span>
                  </div>
                  {/* Mini bar chart */}
                  <div className="flex items-end gap-0.5 h-12 mt-auto">
                    {BAR_HEIGHTS.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: barsReady ? 1 : 0 }}
                        transition={{
                          delay: 0.9 + i * 0.06,
                          duration: 0.5,
                          ease: expo,
                        }}
                        whileHover={{
                          scaleY: 1.15,
                          backgroundColor: "rgba(124,92,252,0.8)",
                        }}
                        style={{ height: `${h}%`, originY: 1 }}
                        className="flex-1 rounded-sm bg-primary/30 cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Insight chip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl p-3.5 flex flex-col gap-2 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,92,252,0.2) 0%, rgba(124,92,252,0.08) 100%)",
                    border: "1px solid rgba(124,92,252,0.25)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Zap
                      size={10}
                      className="text-primary"
                      fill="currentColor"
                    />
                    <span className="text-[9px] font-bold text-primary tracking-wide">
                      Insight
                    </span>
                  </div>
                  <p className="text-[9px] text-white/50 leading-relaxed">
                    2 rarely-used subs. Cancel to save{" "}
                    <span className="text-secondary font-bold">$25/mo</span>
                  </p>
                  <div className="text-[9px] font-bold text-white/60 flex items-center gap-0.5 hover:text-white transition-colors">
                    Review <ChevronRight size={9} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reflection */}
      <div
        className="w-full h-16 mt-0.5 rounded-b-2xl opacity-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(124,92,252,0.08), transparent)",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          transform: "scaleY(-1)",
        }}
      />
    </div>
  );
}

/* ─── features bento ─────────────────────────────────── */
const features = [
  {
    icon: Repeat,
    title: "One place for everything",
    body: "Netflix, AWS, Figma, your gym — log them all once. Subsense tracks every renewal so you don't have to.",
    cols: "md:col-span-2",
  },
  {
    icon: Bell,
    title: "Renewal alerts that work",
    body: "Email reminders before any charge hits. No more surprise bills.",
    cols: "md:col-span-1",
  },
  {
    icon: BarChart3,
    title: "Spending insights",
    body: "Monthly burn rate, yearly projections, and category breakdowns.",
    cols: "md:col-span-1",
  },
  {
    icon: TrendingDown,
    title: "Cut what you don't use",
    body: "Mark subscriptions you rarely use and see exactly how much you'd save by cancelling.",
    cols: "md:col-span-2",
  },
  {
    icon: Zap,
    title: "Instant setup",
    body: "No integrations, no bank connections. Add your first subscription in under a minute and see your numbers immediately.",
    cols: "md:col-span-2",
  },
  {
    icon: Globe,
    title: "Multi-currency support",
    body: "Track in any currency. Subsense normalizes everything into your preferred currency for clean totals.",
    cols: "md:col-span-1",
  },
];

const steps = [
  {
    n: "01",
    title: "Add your subs",
    body: "Enter each subscription — name, amount, billing cycle, renewal date. Less than a minute each.",
  },
  {
    n: "02",
    title: "Get notified",
    body: "Subsense emails you before renewals hit and flags anything that looks off.",
  },
  {
    n: "03",
    title: "Stay in control",
    body: "Cancel what you don't use, spot price hikes early, know your numbers.",
  },
];

/* ─── magnetic button ─────────────────────────────────── */
function MagneticButton({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ─── page ───────────────────────────────────────────── */
export function LandingPage() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "Dark" || theme === "Auto";
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── floating nav ── */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <motion.nav
          initial={{ opacity: 0, y: -24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: expo }}
          className="flex items-center justify-between px-5 h-12 rounded-2xl border border-white/10 bg-background/70 backdrop-blur-2xl shadow-xl shadow-black/30"
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image
                src="/white_logo_mark.svg"
                alt="Subsense"
                width={19}
                height={19}
                style={{ width: 19, height: "auto" }}
              />
            </motion.div>
            <span className="hidden sm:block text-xs font-black tracking-widest uppercase text-primary font-display group-hover:text-primary/80 transition-colors">
              Subsense
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setTheme(isDark ? "Light" : "Dark")}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "moon" : "sun"}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {isDark ? <Moon size={14} /> : <Sun size={14} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            {sessionLoading ? (
              <div className="h-7 w-32 rounded-xl bg-white/10 animate-pulse" />
            ) : isLoggedIn ? (
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 whitespace-nowrap"
                >
                  Go to Dashboard <ArrowRight size={11} />
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  Sign in
                </Link>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 whitespace-nowrap"
                  >
                    Get started <ArrowRight size={11} />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.nav>
      </div>

      {/* ── hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Animated background blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-175 h-175 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute bottom-1/4 right-1/4 w-125 h-125 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[1fr_1.15fr] gap-12 xl:gap-20 items-center pt-28 pb-16">
          {/* Left — copy */}
          <motion.div
            style={{ y: headlineY }}
            className="flex flex-col gap-8 relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: expo }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase">
                <motion.span
                  animate={{ rotate: [0, 15, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                >
                  <Zap size={9} fill="currentColor" />
                </motion.span>
                Subscription intelligence
              </span>
            </motion.div>

            <div className="flex flex-col gap-4">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: expo, delay: 0.1 }}
                  className="text-5xl lg:text-6xl xl:text-[68px] font-black font-display leading-[1.03] tracking-tight"
                >
                  Stop paying for things
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: expo, delay: 0.2 }}
                  className="flex items-baseline gap-3 flex-wrap"
                >
                  <span className="text-5xl lg:text-6xl xl:text-[68px] font-black font-display leading-[1.03] tracking-tight">
                    you{" "}
                  </span>
                  <span className="relative inline-block">
                    <span
                      className="text-5xl lg:text-6xl xl:text-[68px] font-black font-display leading-[1.03] tracking-tight text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #7c5cfc 0%, #a78bfa 50%, #2dd4bf 100%)",
                      }}
                    >
                      forgot about.
                    </span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.1, duration: 0.8, ease: expo }}
                      className="absolute -bottom-1 inset-x-0 h-0.75 rounded-full origin-left"
                      style={{
                        background: "linear-gradient(90deg, #7c5cfc, #2dd4bf)",
                      }}
                    />
                  </span>
                </motion.div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: expo, delay: 0.45 }}
              className="text-lg text-muted leading-relaxed max-w-md"
            >
              One dashboard. Every recurring cost. Renewal alerts, spend
              insights, and the clarity to cut what you don&apos;t use.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: expo, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <MagneticButton
                href="/signup"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-sm font-bold transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50"
              >
                Start for free
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              </MagneticButton>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl border border-border text-sm font-semibold text-muted hover:text-foreground hover:border-white/20 transition-colors"
                >
                  Sign in <ChevronRight size={14} className="text-muted/40" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Social proof numbers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="flex items-center gap-8 pt-2"
            >
              {[
                { val: "12k+", lbl: "subs tracked" },
                { val: "$2.4k", lbl: "avg. saved/yr" },
                { val: "Free", lbl: "forever" },
              ].map((s, i) => (
                <motion.div
                  key={s.lbl}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.95 + i * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="flex flex-col gap-0.5"
                >
                  <span className="text-xl font-black font-mono text-foreground">
                    {s.val}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted/50">
                    {s.lbl}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — interactive mockup */}
          <motion.div
            style={{ y: mockupY, opacity: mockupOpacity }}
            initial={{ opacity: 0, x: 80, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.1, ease: expo, delay: 0.35 }}
            className="relative hidden lg:block"
          >
            {/* Glow */}
            <motion.div
              animate={{ opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-10 rounded-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(124,92,252,0.3) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <DashboardMockup />
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6, ease: expo }}
              className="absolute -bottom-5 -left-6 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-tertiary/30 bg-background/90 backdrop-blur-xl shadow-xl"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-tertiary"
              />
              <span className="text-xs font-bold text-foreground">
                Netflix renews tomorrow
              </span>
            </motion.div>
            {/* Floating savings badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.6, ease: expo }}
              className="absolute -top-4 -right-4 flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-secondary/30 bg-background/90 backdrop-blur-xl shadow-xl"
            >
              <CheckCircle2 size={13} className="text-secondary" />
              <span className="text-xs font-bold text-foreground">
                $25/mo saved
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted/30">
            Scroll
          </span>
          <motion.div
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-linear-to-b from-primary/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── animated stats strip ── */}
      <section className="border-y border-border overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(124,92,252,0.03) 0%, transparent 50%, rgba(45,212,191,0.03) 100%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            {
              prefix: "$",
              to: 2400,
              suffix: "",
              lbl: "avg. saved per year",
              decimals: 0,
            },
            {
              prefix: "",
              to: 94,
              suffix: "%",
              lbl: "renewal accuracy",
              decimals: 0,
            },
            {
              prefix: "",
              to: 2,
              suffix: " min",
              lbl: "to get started",
              decimals: 0,
            },
          ].map((s, i) => (
            <motion.div
              key={s.lbl}
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="flex flex-col items-center gap-2 px-6 py-6 md:py-2"
            >
              <span className="text-5xl font-black font-mono text-foreground whitespace-nowrap">
                <Counter
                  to={s.to}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted/50 text-center">
                {s.lbl}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── features bento ── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="flex flex-col gap-3 mb-14">
          <motion.span
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[10px] font-bold tracking-widest uppercase text-primary"
          >
            Everything you need
          </motion.span>
          <motion.h2
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="text-3xl md:text-4xl font-black font-display leading-tight max-w-xl"
          >
            Built for people who care about where their money goes
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={rise}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.8}
                whileHover={{
                  y: -6,
                  borderColor: "rgba(124,92,252,0.4)",
                  transition: { duration: 0.3 },
                }}
                className={`${f.cols} flex flex-col gap-5 p-7 rounded-2xl bg-surface border border-border group cursor-default transition-shadow hover:shadow-lg hover:shadow-primary/10`}
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                >
                  <Icon size={20} className="text-primary" />
                </motion.div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-black text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{f.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── how it works ── */}
      <section className="border-t border-border overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="flex flex-col gap-3 mb-14">
            <motion.span
              variants={slideRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[10px] font-bold tracking-widest uppercase text-secondary"
            >
              How it works
            </motion.span>
            <motion.h2
              variants={slideRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="text-3xl md:text-4xl font-black font-display leading-tight max-w-xl"
            >
              Up and running before your next renewal
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                variants={rise}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ backgroundColor: "rgba(124,92,252,0.04)" }}
                className="relative flex flex-col gap-6 p-8 bg-background cursor-default transition-colors"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                  className="text-7xl font-black font-mono leading-none select-none"
                  style={{ color: "rgba(124,92,252,0.08)" }}
                >
                  {s.n}
                </motion.span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-black text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{s.body}</p>
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.6 + i * 0.1,
                      duration: 0.4,
                      ease: expo,
                    }}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-6 h-6 rounded-full bg-background border border-border items-center justify-center"
                  >
                    <ChevronRight size={12} className="text-muted/40" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(124,92,252,0.5), transparent)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-125 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(124,92,252,0.25) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-32 flex flex-col items-center text-center gap-8 relative">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-5"
          >
            <motion.h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-display leading-[1.05]">
              Your subscriptions are{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #7c5cfc 0%, #2dd4bf 100%)",
                }}
              >
                bleeding you dry.
              </span>
            </motion.h2>
            <p className="text-base text-muted max-w-lg leading-relaxed">
              The average person wastes $624/year on forgotten subscriptions.
              Subsense helps you find and fix that — for free.
            </p>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <MagneticButton
              href="/signup"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-white text-sm font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow"
            >
              Start for free — takes 2 minutes
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </MagneticButton>
          </motion.div>

          <motion.p
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="text-xs text-muted/40"
          >
            No credit card required · Delete your account anytime
          </motion.p>
        </div>
      </section>

      {/* ── footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <Image
              src="/white_logo_mark.svg"
              alt="Subsense"
              width={16}
              height={16}
              style={{ width: 16, height: "auto" }}
            />
            <span className="text-xs font-black tracking-widest uppercase text-muted font-display">
              Subsense
            </span>
            <span className="text-xs text-muted/30">
              © {new Date().getFullYear()}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-5"
          >
            {[
              { label: "Sign in", href: "/login" },
              { label: "Sign up", href: "/signup" },
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-muted/50 hover:text-muted transition-colors font-semibold"
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
