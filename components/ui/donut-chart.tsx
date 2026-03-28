"use client";

import { motion } from "framer-motion";

interface DonutSegment {
  label: string;
  value: number;
  color: string; // css color value
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  formatValue?: (value: number) => string;
}

const R = 35;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
  formatValue,
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  const lengths = segments.map((seg) => (seg.value / total) * CIRCUMFERENCE);
  const arcs = segments.map((seg, i) => ({
    ...seg,
    dasharray: `${lengths[i]} ${CIRCUMFERENCE}`,
    dashoffset: -lengths.slice(0, i).reduce((s, l) => s + l, 0),
  }));

  return (
    <div className="flex flex-col xl:flex-row items-center gap-4 xl:gap-6">
      {/* SVG donut */}
      <div className="relative shrink-0">
        <svg
          width="140"
          height="140"
          viewBox="0 0 100 100"
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="10"
          />
          {arcs.map((arc, i) => (
            <motion.circle
              key={arc.label}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={arc.color}
              strokeWidth="10"
              strokeLinecap="butt"
              strokeDasharray={arc.dasharray}
              strokeDashoffset={arc.dashoffset}
              initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
              animate={{ strokeDasharray: arc.dasharray }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </svg>
        {/* Center label */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerLabel && (
              <span className="text-[8px] font-semibold tracking-widest uppercase text-muted">
                {centerLabel}
              </span>
            )}
            {centerValue && (
              <span className="text-sm font-bold text-foreground">
                {centerValue}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <ul className="flex flex-col gap-3 w-full xl:min-w-48">
        {segments.map((seg) => (
          <li
            key={seg.label}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-sm text-muted">{seg.label}</span>
            </div>
            <span className="text-sm font-bold text-foreground font-mono">
              {formatValue
                ? formatValue(seg.value)
                : `$${seg.value.toFixed(2)}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
