"use client";

import { animate, useReducedMotion } from "motion/react";
import { type CSSProperties, useId, useRef, useState } from "react";
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
 * radio-group semantics and arrow-key navigation.
 *
 * The dark pill is one element positioned with CSS from the selected index
 * (options are equal width), so it is right on the server render too. The
 * "liquid" move: the edge facing the direction of travel runs ahead fast
 * while the trailing edge follows a moment later, so the pill stretches
 * towards the target and pulls itself together on arrival; a small vertical
 * squash (Motion) sells the volume change. It never leaves the track.
 *
 * Self-designed states: hover = green text on a tint, pressed = small
 * shrink, focus = ring on the option.
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
  const pill = useRef<HTMLSpanElement>(null);
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [direction, setDirection] = useState<"left" | "right">("right");

  const select = (next: T) => {
    const nextIndex = options.findIndex((option) => option.value === next);
    if (nextIndex === index) return;
    setDirection(nextIndex > index ? "right" : "left");
    if (pill.current && !reduce) {
      animate(
        pill.current,
        { scaleY: [1, 0.84, 1.04, 1] },
        { duration: 0.5, times: [0, 0.35, 0.75, 1], ease: "easeInOut" },
      );
    }
    onChange(next);
  };

  return (
    <fieldset className={cn("m-0 min-w-0 border-0 p-0", className)}>
      <legend className="sr-only">{label}</legend>
      {/* The track is a div: a fieldset does not pass its height on to a
          flex layout in Chrome, which left the options content-high. */}
      <div
        style={
          {
            "--n": options.length,
            "--i": index,
            "--seg":
              "calc((100% - 0.5rem - (var(--n) - 1) * 0.25rem) / var(--n))",
          } as CSSProperties
        }
        className="relative flex h-control gap-1 rounded-full border-[0.5px] border-primary p-1"
      >
        <span
          ref={pill}
          aria-hidden
          data-direction={direction}
          className={cn(
            "absolute inset-y-1 rounded-full bg-primary",
            "left-[calc(0.25rem+var(--i)*(var(--seg)+0.25rem))]",
            "right-[calc(0.25rem+(var(--n)-1-var(--i))*(var(--seg)+0.25rem))]",
            // Leading edge fast, trailing edge a beat later and slower.
            "data-[direction=right]:[transition:right_260ms_var(--ease-out-expo),left_460ms_cubic-bezier(0.65,0,0.35,1)_60ms]",
            "data-[direction=left]:[transition:left_260ms_var(--ease-out-expo),right_460ms_cubic-bezier(0.65,0,0.35,1)_60ms]",
          )}
        />
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "relative flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full px-3 whitespace-nowrap",
                "text-badge font-medium transition-[color,background-color,scale] duration-(--duration-base) ease-standard",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                "active:scale-[0.97]",
                // The new option turns white at once (the pill's leading edge
                // reaches it first); the old one waits for the trailing edge
                // to leave before turning dark, so no text vanishes on the pill.
                checked
                  ? "text-on-primary"
                  : "text-heading delay-[260ms] hover:bg-faq-tint hover:text-accent hover:delay-0",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => select(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
