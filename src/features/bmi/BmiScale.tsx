"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";
import {
  BMI_THRESHOLDS,
  type BmiCategory,
  categorize,
  scalePosition,
} from "./bmi";

/**
 * Legend labels generated from the thresholds (F08: the design's hand-typed
 * ranges "<18.5 - 24.9" / "<25.0 - 29.9" were wrong).
 */
function rangeLabel(index: number): string {
  const current = BMI_THRESHOLDS[index];
  const next = BMI_THRESHOLDS[index + 1];
  if (!current) return "";
  if (index === 0 && next) return `<${next.min}`;
  if (!next) return `≥ ${current.min}`;
  return `${current.min}–${(next.min - 0.1).toFixed(1)}`;
}

/** Gradient scale with the four categories; a marker shows the result. */
export function BmiScale({ bmi }: { bmi: number | null }) {
  const reduce = useReducedMotion();
  const active: BmiCategory | null = bmi === null ? null : categorize(bmi);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative h-1.5 rounded-full bg-(image:--gradient-bmi)">
        {bmi !== null ? (
          <motion.span
            aria-hidden
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-surface shadow-pill"
            initial={false}
            animate={{ left: `${scalePosition(bmi) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
      </div>
      <ul className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-caption text-muted">
        {BMI_THRESHOLDS.map(({ category }, index) => (
          <li
            key={category}
            className={cn(
              "flex gap-1",
              active === category && "font-medium text-heading",
            )}
            aria-current={active === category ? "true" : undefined}
          >
            <span>{uiCopy.bmi.categories[category]}</span>
            <span>{rangeLabel(index)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
