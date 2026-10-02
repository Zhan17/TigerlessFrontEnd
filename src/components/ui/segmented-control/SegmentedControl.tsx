"use client";

import { animate, useReducedMotion } from "motion/react";
import { type CSSProperties, useId, useRef } from "react";
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

/** Pill geometry from the selected index (options are equal width). */
const lobe =
  "absolute inset-y-1 rounded-full bg-primary left-[calc(0.25rem+var(--i)*(var(--seg)+0.25rem))] right-[calc(0.25rem+(var(--n)-1-var(--i))*(var(--seg)+0.25rem))]";

/**
 * Two-or-more option switch (BMI units). Native radio inputs give the
 * radio-group semantics and arrow-key navigation.
 *
 * The selection is a blob of liquid made of two lobes that normally sit on
 * top of each other, both positioned with CSS from the selected index (so
 * the server render is right). On a switch the front lobe flows to the new
 * option first while the back lobe holds, so the blob stretches into a
 * dumbbell; an SVG "goo" filter (blur + alpha threshold) on the liquid
 * layer draws the surface tension between them, a thin waist that thickens
 * as the back lobe follows, until the two merge into one pill. A small
 * vertical squash sells the volume change. Nothing appears out of nowhere
 * and nothing leaves the track; reduced motion jumps.
 *
 * Layers: hover tint (z-0) < liquid (z-10) < label text (z-20), so a hover
 * tint never covers the liquid and the text is always on top.
 *
 * Self-designed states: hover = green text on a tint, pressed = small
 * shrink of the text, focus = ring on the option.
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
  const liquid = useRef<HTMLDivElement>(null);
  const goo = `${name}-goo`;
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const select = (next: T) => {
    if (next === value) return;
    if (liquid.current && !reduce) {
      animate(
        liquid.current,
        { scaleY: [1, 0.88, 1.03, 1] },
        { duration: 0.65, times: [0, 0.4, 0.8, 1], ease: "easeInOut" },
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
        className="relative isolate flex h-control gap-1 rounded-full border-[0.5px] border-primary p-1"
      >
        {/* Goo filter: blur, then a hard alpha threshold re-draws the
            edges, so shapes close together grow a bridge; the original
            graphic is laid back on top to keep the edges crisp. */}
        <svg aria-hidden="true" className="absolute size-0">
          <defs>
            <filter id={goo}>
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="5"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        <div
          ref={liquid}
          aria-hidden
          className="absolute inset-0 z-10"
          style={{ filter: `url(#${goo})` }}
        >
          {/* Front lobe: sets off at once and arrives fast. */}
          <span
            className={cn(
              lobe,
              "[transition:left_380ms_cubic-bezier(0.22,1,0.36,1),right_380ms_cubic-bezier(0.22,1,0.36,1)]",
            )}
          />
          {/* Back lobe: holds a moment, then follows and merges. */}
          <span
            className={cn(
              lobe,
              "[transition:left_460ms_cubic-bezier(0.65,0,0.35,1)_160ms,right_460ms_cubic-bezier(0.65,0,0.35,1)_160ms]",
            )}
          />
        </div>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                "group/option relative flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-full px-3 whitespace-nowrap",
                "text-badge font-medium",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
              )}
            >
              {/* Hover tint, below the liquid layer. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 z-0 rounded-full transition-colors duration-(--duration-base) ease-standard",
                  !checked && "group-hover/option:bg-faq-tint",
                )}
              />
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => select(option.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  // Text above the liquid; the press shrink lives here so the
                  // label never becomes its own stacking context.
                  "relative z-20 transition-[color,scale] duration-(--duration-base) ease-standard group-active/option:scale-[0.97]",
                  // The new option turns white as the front lobe reaches it;
                  // the old one waits for the back lobe to leave.
                  checked
                    ? "text-on-primary delay-[40ms]"
                    : "text-heading delay-[360ms] group-hover/option:text-accent group-hover/option:delay-0",
                )}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
