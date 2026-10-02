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
 * (options are equal width), so it is right on the server render too.
 * The switch behaves like two drops of liquid meeting: a small droplet
 * swells at the new option, the pill flows towards it (leading edge first,
 * trailing edge a beat later), and an SVG "goo" filter (blur + alpha
 * threshold) on the layer behind the labels draws the surface-tension
 * bridge between them: a thin neck that thickens until they merge. A small
 * vertical squash sells the volume change. The labels are not filtered, so
 * the text stays crisp; nothing leaves the track; reduced motion jumps.
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
  const droplet = useRef<HTMLSpanElement>(null);
  const goo = `${name}-goo`;
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [direction, setDirection] = useState<"left" | "right">("right");

  const select = (next: T) => {
    const nextIndex = options.findIndex((option) => option.value === next);
    if (nextIndex === index) return;
    setDirection(nextIndex > index ? "right" : "left");
    if (pill.current && droplet.current && !reduce) {
      // The droplet swells first; the pill sets off a moment later.
      animate(
        droplet.current,
        { scale: [0, 1] },
        { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      );
      animate(
        pill.current,
        { scaleY: [1, 0.84, 1.04, 1] },
        {
          duration: 0.6,
          delay: 0.22,
          times: [0, 0.35, 0.75, 1],
          ease: "easeInOut",
        },
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
                stdDeviation="4"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        {/* Layers: hover tints (z-0) < liquid (z-10) < label text (z-20),
            so the pill and droplet always paint over a fading hover tint
            and the text always paints over the pill. */}
        <div
          aria-hidden
          className="absolute inset-0 z-10"
          style={{ filter: `url(#${goo})` }}
        >
          <span
            ref={droplet}
            data-direction={direction}
            className={cn(
              "absolute top-1/2 size-5.5 -translate-1/2 rounded-full bg-primary",
              // It forms just inside the new option, on the side facing the
              // pill, so it touches the pill as it swells (thin neck first)
              // and covers as little of the label as possible.
              "data-[direction=right]:left-[calc(0.25rem+var(--i)*(var(--seg)+0.25rem)+1.0625rem)]",
              "data-[direction=left]:left-[calc(0.25rem+var(--i)*(var(--seg)+0.25rem)+var(--seg)-1.0625rem)]",
            )}
            // Hidden until a switch; Motion animates `transform`, so the
            // resting state is set there too (not the `scale` property).
            style={{ transform: "scale(0)" }}
          />
          <span
            ref={pill}
            data-direction={direction}
            className={cn(
              "absolute inset-y-1 rounded-full bg-primary",
              "left-[calc(0.25rem+var(--i)*(var(--seg)+0.25rem))]",
              "right-[calc(0.25rem+(var(--n)-1-var(--i))*(var(--seg)+0.25rem))]",
              // Leading edge first (after the droplet appears), trailing
              // edge a beat later and slower.
              "data-[direction=right]:[transition:right_520ms_cubic-bezier(0.6,0,0.25,1)_200ms,left_480ms_cubic-bezier(0.65,0,0.35,1)_380ms]",
              "data-[direction=left]:[transition:left_520ms_cubic-bezier(0.6,0,0.25,1)_200ms,right_480ms_cubic-bezier(0.65,0,0.35,1)_380ms]",
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
                  // The new option turns white as the pill's leading edge
                  // reaches it; the old one waits for the trailing edge to
                  // leave before turning dark, so no text vanishes on the pill.
                  checked
                    ? "text-on-primary delay-[400ms]"
                    : "text-heading delay-[520ms] group-hover/option:text-accent group-hover/option:delay-0",
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
