"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { gaugeFraction } from "./bmi";

type BmiGaugeProps = {
  bmi: number | null;
  label: string;
  className?: string;
};

const R = 84; // progress ring radius (viewBox 217)
const C = 2 * Math.PI * R;

/**
 * Circular BMI gauge drawn as SVG from the value (the design's static ring
 * image is not used). Empty state shows "—". On a new result the arc fills
 * and the number counts up (self-designed); instant under reduced motion.
 */
export function BmiGauge({ bmi, label, className }: BmiGaugeProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(bmi);

  useEffect(() => {
    if (bmi === null || reduce) {
      setDisplay(bmi);
      return;
    }
    const controls = animate(0, bmi, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setDisplay(Math.round(value * 10) / 10),
    });
    return () => controls.stop();
  }, [bmi, reduce]);

  const fraction = bmi === null ? 0 : gaugeFraction(bmi);

  return (
    <div className={cn("relative aspect-square", className)}>
      <svg viewBox="0 0 217 217" className="size-full" aria-hidden="true">
        {/* Outer dashed guide ring */}
        <circle
          cx="108.5"
          cy="108.5"
          r="106"
          fill="none"
          stroke="var(--color-sage-200)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* Track */}
        <circle
          cx="108.5"
          cy="108.5"
          r={R}
          fill="none"
          stroke="var(--color-step)"
          strokeWidth="10"
        />
        {/* Value arc, from 12 o'clock clockwise */}
        <motion.circle
          cx="108.5"
          cy="108.5"
          r={R}
          fill="none"
          stroke="var(--color-green-500)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          transform="rotate(-90 108.5 108.5)"
          initial={false}
          animate={{ strokeDashoffset: C * (1 - fraction) }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-ink-780">
        <span className="text-score tabular-nums">
          {display === null ? "—" : display.toFixed(1)}
        </span>
        <span className="max-w-[7rem] text-body-sm leading-[1.32]">
          {label}
        </span>
      </div>
    </div>
  );
}
