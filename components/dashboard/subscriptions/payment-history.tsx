"use client";

import { motion } from "framer-motion";
import { TickCircle } from "iconsax-reactjs";

const payments = [
  {
    id: "1",
    name: "September Payment",
    date: "Sep 24, 2024",
    card: "Visa ···· 4242",
    amount: 15.99,
  },
  {
    id: "2",
    name: "August Payment",
    date: "Aug 24, 2024",
    card: "Visa ···· 4242",
    amount: 15.99,
  },
  {
    id: "3",
    name: "July Payment",
    date: "Jul 24, 2024",
    card: "Visa ···· 4242",
    amount: 15.99,
  },
  {
    id: "4",
    name: "June Payment",
    date: "Jun 24, 2024",
    card: "Visa ···· 4242",
    amount: 15.99,
  },
];

export function PaymentHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold text-foreground">Payment History</h2>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
            Transaction
          </span>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-muted">
            Amount
          </span>
        </div>

        {/* Rows */}
        <ul className="divide-y divide-border">
          {payments.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.25 + i * 0.06,
                duration: 0.3,
                ease: "easeOut",
              }}
              className="flex items-center gap-3 px-5 py-4"
            >
              <TickCircle
                size={20}
                color="var(--color-secondary)"
                variant="Bold"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {p.name}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {p.date} • {p.card}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground font-mono">
                ${p.amount.toFixed(2)}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* View all */}
        <button className="w-full py-4 bg-background text-xs font-bold tracking-widest uppercase text-primary hover:opacity-80 transition-opacity text-center">
          View All Transactions
        </button>
      </div>
    </motion.div>
  );
}
