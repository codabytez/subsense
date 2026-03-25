"use client";

import { motion } from "framer-motion";

export function InsightCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
      className="bg-primary rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-white">Subsense Insight</h3>
        <p className="text-sm text-white/75 leading-relaxed">
          You have 3 entertainment subs that haven&apos;t been opened in 14
          days. Potential savings:{" "}
          <span className="text-white font-bold">$42.00</span>.
        </p>
      </div>

      <button className="w-full bg-white/90 hover:bg-white transition-colors text-neutral font-bold text-sm py-2.5 rounded-xl">
        Optimize Spend
      </button>
    </motion.div>
  );
}
