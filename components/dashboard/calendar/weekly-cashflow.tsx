"use client";

import { motion } from "framer-motion";

const CHART_H = 300;
const LABEL_H = 28;

const days = [
  { label: "Mon", fixed: 0, variable: 0 },
  { label: "Tue", fixed: 52.99, variable: 0 },
  { label: "Wed", fixed: 0, variable: 15.99 },
  { label: "Thu", fixed: 20.0, variable: 0 },
  { label: "Fri", fixed: 8.0, variable: 0 },
  { label: "Sat", fixed: 0, variable: 0 },
  { label: "Sun", fixed: 9.99, variable: 82.51 },
];

const max = Math.max(...days.flatMap((d) => [d.fixed, d.variable]));

function toH(amount: number) {
  if (!amount || max === 0) return 0;
  return Math.max(8, Math.round((amount / max) * CHART_H));
}

export function WeeklyCashFlow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
      className="bg-surface border border-border rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Weekly Cash Flow
          </h2>
          <p className="text-sm text-muted mt-0.5">
            Daily distribution of subscription costs
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
              }}
            />
            <span className="text-xs text-muted font-medium">Fixed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "var(--color-secondary)",
              }}
            />
            <span className="text-xs text-muted font-medium">Variable</span>
          </div>
        </div>
      </div>

      {/* Chart rows */}
      <div className="flex gap-3 items-end min-h-70">
        {days.map((d, i) => {
          const fixedH = toH(d.fixed);
          const varH = toH(d.variable);
          const hasBoth = d.fixed > 0 && d.variable > 0;

          return (
            <div
              key={d.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Bar area */}
              <div
                style={{ position: "relative", width: "100%", height: CHART_H }}
              >
                {/* Fixed bar — left half if both, full width otherwise */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: d.fixed > 0 ? fixedH : 6 }}
                  transition={{
                    delay: 0.3 + i * 0.07,
                    duration: 0.55,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: hasBoth ? "50%" : "100%",
                    borderRadius: hasBoth ? "4px 0 0 0" : "4px 4px 0 0",
                    backgroundColor:
                      d.fixed > 0
                        ? "var(--color-primary)"
                        : "rgba(255,255,255,0.06)",
                  }}
                />

                {/* Variable bar — right half, no gap */}
                {d.variable > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: varH }}
                    transition={{
                      delay: 0.35 + i * 0.07,
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: hasBoth ? "50%" : 0,
                      width: hasBoth ? "50%" : "100%",
                      borderRadius: hasBoth ? "0 4px 0 0" : "4px 4px 0 0",
                      backgroundColor: "var(--color-secondary)",
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 10,
                  color: "var(--color-muted)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  height: LABEL_H,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
