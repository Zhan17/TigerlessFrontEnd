"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/cn";

export type SegmentedOption<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  /** Accessible name of the group. */
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * Two-or-more option switch (BMI units). Native radio inputs give the
 * radio-group semantics and arrow-key navigation; the dark pill slides to the
 * selected option with a short "liquid" squash-and-stretch (Motion layout
 * animation). Self-designed states: hover = green text on a tint, pressed =
 * small shrink, focus = ring on the option.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const name = useId();
  const reduce = useReducedMotion();

  return (
    <fieldset
      className={cn(
        "m-0 inline-flex h-control min-w-0 items-stretch gap-1 rounded-full border-[0.5px] border-primary p-1",
        className,
      )}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              "relative flex min-w-20 flex-1 cursor-pointer items-center justify-center rounded-full px-3 whitespace-nowrap",
              "text-badge font-medium transition-[color,background-color,scale] duration-(--duration-base) ease-standard",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
              "active:scale-[0.97]",
              checked
                ? "text-on-primary"
                : "text-heading hover:bg-faq-tint hover:text-accent",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {checked ? (
              <motion.span
                layoutId={`${name}-pill`}
                aria-hidden
                className="absolute inset-0 rounded-full bg-primary"
                // Liquid feel: the pill stretches while it travels, then settles.
                animate={
                  reduce
                    ? undefined
                    : { scaleX: [1, 1.18, 1], scaleY: [1, 0.86, 1] }
                }
                transition={{
                  layout: { type: "spring", stiffness: 520, damping: 34 },
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
