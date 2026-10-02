import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRightCircleFilledIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Pill button from the design. Sizes: lg = 56px (hero CTA, BMI), md = 48px
 * (nav, cards, menu). Variants: primary (dark), secondary (white, on tinted
 * cards), outline (Login).
 *
 * Interaction states are self-designed (the file has no hover designs):
 * hover = slight "bubble" lift + tone shift, pressed = slight shrink, focus =
 * the global focus ring. `hover:` only applies on devices that can hover, so
 * touch screens get the press feedback only. Styled with CSS so Storybook's
 * pseudo-states addon can show each state.
 */
export const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full",
    "text-button font-medium whitespace-nowrap select-none",
    "transition-[scale,translate,background-color,box-shadow,color] duration-(--duration-base) ease-standard",
    "enabled:hover:scale-[1.03] enabled:active:scale-[0.97]",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary enabled:hover:bg-brand-800 enabled:hover:shadow-soft",
        secondary: "bg-surface text-heading-strong enabled:hover:shadow-card",
        outline:
          "border border-primary bg-transparent text-heading enabled:hover:bg-selected",
      },
      size: {
        lg: "h-14 px-8",
        md: "h-12 px-8",
      },
      withArrow: {
        true: "pr-2",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Full-width buttons with an arrow (mobile cards) push the arrow to the edge.
      {
        fullWidth: true,
        withArrow: true,
        className: "justify-between pl-6",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      withArrow: false,
      fullWidth: false,
    },
  },
);

const arrowStyles = {
  // Primary: white circle, dark arrow. Secondary: dark circle, white arrow.
  primary: "text-white [--icon-contrast:var(--color-brand-900)]",
  secondary: "text-ink-900 [--icon-contrast:var(--color-white)]",
  outline: "text-primary [--icon-contrast:var(--color-white)]",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
  };

export function Button({
  variant = "primary",
  size = "md",
  withArrow = false,
  fullWidth = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        buttonVariants({ variant, size, withArrow, fullWidth }),
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {withArrow ? (
        <ArrowRightCircleFilledIcon
          className={cn(
            "shrink-0 transition-transform duration-(--duration-base) ease-standard",
            "group-hover/button:translate-x-0.5 group-disabled/button:translate-x-0",
            size === "lg" ? "size-10" : "size-8",
            arrowStyles[variant ?? "primary"],
          )}
        />
      ) : null}
    </button>
  );
}
