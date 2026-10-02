import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type PillProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-pressed"
> & {
  selected?: boolean;
};

/**
 * Language pill from the hero. A toggle button: clicking highlights it
 * (visual selection only, decision C1). Pass `lang` / `dir` for scripts such
 * as Arabic so the label is read and rendered correctly.
 *
 * Self-designed states: hover = bubble pop (scale 1.05) + tint, pressed =
 * scale 0.96, focus = global ring, selected = the design's light-green fill.
 */
export function Pill({
  selected = false,
  className,
  type = "button",
  ...props
}: PillProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center justify-center h-pill rounded-full border px-pill-x",
        "text-label whitespace-nowrap shadow-pill",
        "transition-[scale,background-color,border-color,color] duration-(--duration-base) ease-standard",
        "hover:scale-[1.05] active:scale-[0.96]",
        selected
          ? "border-selected bg-selected text-ink-780"
          : "border-selected bg-off-white text-ink-600 hover:bg-faq-tint",
        className,
      )}
      {...props}
    />
  );
}
