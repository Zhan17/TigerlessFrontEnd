import type { InputHTMLAttributes, ReactNode } from "react";
import { RadioCheckedIcon, RadioUncheckedIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type RadioPillProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
};

/**
 * Pill-shaped radio option (BMI "Sex"). A native radio keeps group
 * semantics and keyboard behaviour; the design's radio icons show the state.
 * Self-designed states: hover = darker border + tint, pressed = small
 * shrink, focus = ring on the pill, checked = filled icon + dark border.
 */
export function RadioPill({
  children,
  checked,
  className,
  ...props
}: RadioPillProps) {
  return (
    <label
      className={cn(
        "flex h-control min-w-0 cursor-pointer items-center gap-1 rounded-full border px-4",
        "text-button text-heading-strong transition-[border-color,background-color,scale] duration-(--duration-base) ease-standard",
        "hover:bg-faq-tint active:scale-[0.97]",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
        checked ? "border-primary" : "border-border hover:border-sage-300",
        className,
      )}
    >
      <input type="radio" checked={checked} className="sr-only" {...props} />
      {checked ? (
        <RadioCheckedIcon className="size-6 shrink-0 text-primary" />
      ) : (
        <RadioUncheckedIcon className="size-6 shrink-0 text-sage-200" />
      )}
      {children}
    </label>
  );
}
